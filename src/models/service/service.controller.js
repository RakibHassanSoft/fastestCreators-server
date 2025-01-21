const sendResponse = require('../../utils/responseHelper');
const serviceService = require('./service.service');

// Create a new service
exports.createService = async (req, res) => {
   try {
    const service = await serviceService.createService(req.user, req.body);
    sendResponse(res, 200, 'Service created successfully', service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await serviceService.getAllServices();
    res.status(200).json(services);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a specific service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    res.status(200).json(service);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  try {
    const service = await serviceService.updateService(req.params.id, req.body);
    sendResponse(res, 200, 'Service Updated successfully', service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
   try {
    const response = await serviceService.deleteService(req.params.id);
    sendResponse(res, 200, 'Service Deleted successfully', service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
