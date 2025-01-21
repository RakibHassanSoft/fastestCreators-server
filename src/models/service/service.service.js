const Service = require('./service.model');
const { validateService, validateUpdatedService } = require('./service.validation');

// Create a new service
exports.createService = async (user, body) => {
  const { error } = validateService(body); // Validate service data using Joi
  if (error) {
    throw new Error(error.details[0].message);
  }
  console.log(body)
  const { title, description ,serviceImage} = body;
  const service = new Service({
    title,
    description,
    serviceImage,
    adminId: user.id, 
  });
  try {
    await service.save();
    return service;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all services
exports.getAllServices = async () => {
  try {
    // Use the `populate` method to include the admin data in the response
    return await Service.find()
      .populate('adminId',) // Only include the fields you need from the admin
  } catch (error) {
    throw new Error(error.message);
  }
};


// Get a specific service by ID
exports.getServiceById = async (id) => {
  try {
    const service = await Service.findById(id);
    if (!service) {
      throw new Error('Service not found');
    }
    return service;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update a service
exports.updateService = async (id, body) => {
  const { error } = validateUpdatedService(body); // Validate service data using Joi
  if (error) {
    throw new Error(error.details[0].message);
  }

  try {
    const service = await Service.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );
    if (!service) {
      throw new Error('Service not found');
    }
    return service;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete a service
exports.deleteService = async (id) => {
  try {
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      throw new Error('Service not found');
    }
    return { message: 'Service deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};
