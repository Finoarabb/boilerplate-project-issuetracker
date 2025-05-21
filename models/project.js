const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    issue_title: { 
        type: String, 
        required: [true, 'required issue_title missing'] 
    },
    project_name: { 
        type: String, 
        required: [true, 'required project_name missing'] 
    },
    issue_text: { 
        type: String, 
        required: [true, 'required issue_text missing'] 
    },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
    created_by: { 
        type: String, 
        required: [true, 'required created_by missing'] 
    },
    assigned_to: { type: String, default: '' },
    open: { type: Boolean, default: true },
    status_text: { type: String, default: '' }
});

module.exports = mongoose.model('Project', projectSchema);