const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const Project = require("../models/project");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  this.beforeAll(async function () {
    const db = await server.db;
    const del = await Project.deleteMany({});
    const ins = await Project.insertMany([
      {
        project_name: "apitest",
        _id: "67f402002334b70013df67fd",
        assigned_to: "joe",
        status_text: "start",
        open: true,
        issue_title: "whatever",
        issue_text: "hmmm",
        created_by: "max",
        created_on: "2025-04-07T16:49:04.436Z",
        updated_on: "2025-04-07T16:49:04.436Z",
      },
      {
        project_name: "apitest",
        _id: "67f52d862334b70013df6810",
        assigned_to: "",
        status_text: "",
        open: true,
        issue_title: "asdbfg",
        issue_text: "fgbgf",
        created_by: "sdfsd",
        created_on: "2025-04-08T14:07:02.480Z",
        updated_on: "2025-04-08T14:07:02.480Z",
      },
    ]);
  });
  suite("GET", () => {
    cases = [
      {
        params: "apitest",
        expected: [
          {
            assigned_to: "joe",
            status_text: "start",
            open: true,
            _id: "67f402002334b70013df67fd",
            issue_title: "whatever",
            issue_text: "hmmm",
            created_by: "max",
            created_on: "2025-04-07T16:49:04.436Z",
            updated_on: "2025-04-07T16:49:04.436Z",
          },
          {
            assigned_to: "",
            status_text: "",
            open: true,
            _id: "67f52d862334b70013df6810",
            issue_title: "asdbfg",
            issue_text: "fgbgf",
            created_by: "sdfsd",
            created_on: "2025-04-08T14:07:02.480Z",
            updated_on: "2025-04-08T14:07:02.480Z",
          },
        ],
      },
      {
        params: "apitest?open=true",
        expected: [
          {
            assigned_to: "joe",
            status_text: "start",
            open: true,
            _id: "67f402002334b70013df67fd",
            issue_title: "whatever",
            issue_text: "hmmm",
            created_by: "max",
            created_on: "2025-04-07T16:49:04.436Z",
            updated_on: "2025-04-07T16:49:04.436Z",
          },
          {
            assigned_to: "",
            status_text: "",
            open: true,
            _id: "67f52d862334b70013df6810",
            issue_title: "asdbfg",
            issue_text: "fgbgf",
            created_by: "sdfsd",
            created_on: "2025-04-08T14:07:02.480Z",
            updated_on: "2025-04-08T14:07:02.480Z",
          },
        ],
      },
      {
        params: "apitest?open=true&status_text=start",
        expected: [
          {
            assigned_to: "joe",
            status_text: "start",
            open: true,
            _id: "67f402002334b70013df67fd",
            issue_title: "whatever",
            issue_text: "hmmm",
            created_by: "max",
            created_on: "2025-04-07T16:49:04.436Z",
            updated_on: "2025-04-07T16:49:04.436Z",
          },
        ],
      },
    ];

    cases.forEach(({ params, expected }) => {
      test(`params ${params}`, (done) => {
        chai
          .request(server.app)
          .get(`/api/issues/${params}`)
          .end((err, res) => {
            res.body = res.body.map(({ __v, project_name, ...rest }) => rest);
            assert.includeDeepMembers(res.body, expected);
            done();
          });
      });
    });
  });

  suite("POST", () => {
    const cases = [
      {
        name: "All field",
        reqBody: {
          assigned_to: "Folk",
          status_text: "In QA",
          issue_title: "Make Issue Tracker",
          issue_text: "i do not know how to do it",
          created_by: "Folk",
        },
        expected: {
          assigned_to: "Folk",
          status_text: "In QA",
          open: true,
          issue_title: "Make Issue Tracker",
          issue_text: "i do not know how to do it",
          created_by: "Folk",
        },
      },
      {
        name: "Only Required field",
        reqBody: {
          issue_title: "Make Issue Tracker",
          issue_text: "i do not know how to do it",
          created_by: "Folk",
        },
        expected: {
          assigned_to: "",
          status_text: "",
          open: true,
          issue_title: "Make Issue Tracker",
          issue_text: "i do not know how to do it",
          created_by: "Folk",
        },
      },
      {
        name: "Missing field",
        reqBody: {
          issue_title: "Make Issue Tracker",
          created_by: "Folk",
        },
        expected: {
          error: "required field(s) missing",
        },
      },
    ];

    cases.forEach(({ name, reqBody, expected }) => {
      test(name, (done) => {
        chai
          .request(server.app)
          .post("/api/issues/apitest")
          .send(reqBody)
          .end((err, res) => {
            if (expected.error) assert.deepEqual(res.body, expected);
            else {
              assert.containsAllKeys(res.body, [
                "_id",
                "created_on",
                "updated_on",
              ]);
              assert.deepInclude(res.body, expected);
            }
            done();
          });
      });
    });
  });

  suite("PUT", () => {
    const cases = [
      {
        name: "One Field",
        reqBody: {
          _id: "67f402002334b70013df67fd",
          open: false,
        },
        expected: {
          result: "successfully updated",
          _id: "67f402002334b70013df67fd",
        },
      },
      {
        name: "Multiple Field",
        reqBody: {
          _id: "67f402002334b70013df67fd",
          issue_text: "a",
          issue_title: "what",
        },
        expected: {
          result: "successfully updated", 
          _id: "67f402002334b70013df67fd"
        },
      },
      {
        name: "Missing Id",
        reqBody: {},
        expected: {
          error: "missing _id",
        },
      },
      {
        name: "Missing Data",
        reqBody: {
          _id: "67f402002334b70013df67fd",
        },
        expected: {
          error: "no update field(s) sent",
          _id: "67f402002334b70013df67fd",
        },
      },
      {
        name: "invalid Id",
        reqBody: {
          _id: "12456567654",
          open: true,
        },
        expected: { error: "could not update", _id: "12456567654" },
      },
    ];

    cases.forEach(({ name, reqBody, expected }) => {
      test(name, (done) => {
        chai
          .request(server.app)
          .put("/api/issues/apitest")
          .send(reqBody)
          .end((err, res) => {
            if (expected.error) assert.deepEqual(res.body, expected);
            else {
              assert.notEqual(res.body.updated_on, "2025-04-07T16:49:04.436Z");
              assert.deepInclude(res.body, expected);
            }
            done();
          });
      });
    });
  });

  suite("DELETE", () => {
    const cases = [
      {
        name: "Success One",
        _id: "67f402002334b70013df67fd",
        expected: {
          result: "successfully deleted",
          _id: "67f402002334b70013df67fd",
        },
      },
      {
        name: "Missing ID",
        expected: {
          error: "missing _id",
        },
      },
      {
        name: "Invalid ID",
        _id: "123124315123456745",
        expected: {
          error: "could not delete",
          _id: "123124315123456745",
        },
      },
    ];

    cases.forEach(({ name, _id, expected }) => {
      test(name, (done) => {
        chai
          .request(server.app)
          .del("/api/issues/apitest")
          .send({ _id })
          .end((err, res) => {
            assert.deepEqual(res.body, expected);
            done();
          });
      });
    });
  });
});
