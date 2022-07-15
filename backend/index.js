const express = require("express");
const cors = require("cors");
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");
const { executeJs } = require("./executeJs");
const mongoose = require("mongoose");
const Job = require("./models/Job");
require("dotenv").config();

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log("CONNECTED TO DATABASE SUCCESSFULLY...");
  }
);

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/status", async (req, res) => {
  const jobId = req.query.id;
  // console.log("Status Requested : ", jobId);

  if (jobId == undefined) {
    return res
      .status(400)
      .json({ success: false, error: "missing id query parameter" });
  }

  try {
    const job = await Job.findById(jobId);
    if (jobId === undefined) {
      return res.status(404).json({ success: false, error: "invalid job id" });
    }

    return res.status(200).json({ success: true, job });
  } catch (err) {
    return res.status(400).json({ success: false, error: JSON.stringify(err) });
  }
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;

  if (code.length === 0) {
    res.status(400).json({ success: false, error: "Empty Code Body!" });
    return;
  }

  let job;

  try {
    const filepath = await generateFile(language, code);

    job = await new Job({ language, filepath }).save();
    // console.log(job);
    const jobId = job["_id"];

    if (jobId) {
      res.status(201).json({ success: true, jobId, filepath });
    }

    // let output;
    let output;

    job["startedAt"] = new Date();
    // console.log("Job Started : ", jobId);
    if (language === "cpp" || language === "c") {
      output = await executeCpp(filepath);
    } else if (language === "py") {
      output = await executePy(filepath);
    } else {
      output = await executeJs(filepath);
    }
    // console.log(output);
    job["completeAt"] = new Date();
    job["status"] = "success";
    job["output"] = output;

    await job.save();
    // console.log("Job Completed : ", jobId);
    // console.log(job);
    // return res.json({ filepath, output });
  } catch (err) {
    job["completeAt"] = new Date();
    job["status"] = "error";
    job["output"] = JSON.stringify(err);
    await job.save();
    // console.log("Job Failed : ", job["_id"]);
    // console.log(job);
    // res.status(500).json({ err });
  }
});

app.listen(5000, () => {
  console.log(`Listening on port 5000...`);
});
