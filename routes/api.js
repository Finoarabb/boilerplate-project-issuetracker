"use strict";

const Project = require("../models/project");

module.exports = function (app) {
  const projects = Project;
  app
    .route("/api/issues/:project")
    .get(async function (req, res) {
      let project = req.params.project;
      const params = req.query;
      try {
        const query = { project_name: project, ...params };
        const result = await projects.find(query).select(!"project_name");
        return res.json(result);
      } catch (error) {
        return res.send(error);
      }
    })

    .post(async function (req, res) {
      let project = req.params.project;
      let data = req.body;
      try {
        const result = await projects.create({
          project_name: project,
          ...data,
        });
        res.json(result);
      } catch (error) {
        res.send({ error: 'required field(s) missing' });
      }
    })

    .put(async function (req, res) {
      let project = req.params.project;
      let data = req.body;
      data = Object.fromEntries(Object.entries(data).filter(([key,value])=>value!==''));
      if (!data._id) return res.send({ error: "missing _id" });
      if (Object.values(data).length===1)
        return res.send({ error: "no update field(s) sent", _id: data._id });
      try {
        const result = await projects.findByIdAndUpdate(data._id,{updated_on:new Date(),...data});
        if (!result) throw res.json({ error: 'could not update', '_id': data._id })
        res.json({ result: "successfully updated", _id: data._id });
      } catch (error) {
        res.json({ error: "could not update", _id: data._id });
      }
    })
    .delete(async function (req, res) {
      let project = req.params.project;
      let id = req.body._id;
      if (!id) return res.send({ error: "missing _id" });
      try {
        const result = await projects.findByIdAndDelete(id);
        if (!result) throw res.json({ error: 'could not delete', '_id': id })
        res.json({ result: "successfully deleted", _id: id });
      } catch (error) {
        res.json({ error: 'could not delete', '_id': id });
      }
    });
};
