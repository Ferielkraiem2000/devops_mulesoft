const mongoose = require('mongoose');

// const OrderSchema = new mongoose.Schema({
//     versioningTool: { type: String, required: true },
//     hostingType: { type: String, required: true },
//     monitoringTool: { type: String, required: true },
//     hostingJarTool: { type: String, required: true },
//     status: { type: String, required: true },
//     customerId: { type: String, required: true },
// });
const OrderSchema = new mongoose.Schema({
    versioningTool: { type: String, required: true },
    hostingType: { type: String, required: true },
    monitoringTool: { type: String, required: false },
    hostingJarTool: { type: String, required: false },
    status: { type: String, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // repoUrl: { type: String, required: false },
    repo: { 
      type: String, 
      required: false,
      validate: {
        validator: function(value) {
          // Ensure the repo field contains a ZIP file path or URL
          return value ? value.endsWith('.zip') : true;
        },
        message: props => `${props.value} is not a valid ZIP file path!`
      }
    }
  },
  { timestamps: true } ); 

module.exports = mongoose.model('Order', OrderSchema);
