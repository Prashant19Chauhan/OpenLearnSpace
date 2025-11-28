import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Upload,
  Save,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Camera,
  X,
} from 'lucide-react';
import { addStaff } from '../../Api/Employee';

const AddEmployee = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    DOB: '',
    nationality: 'Indian',
    maritalStatus: '',
    permanentAddress: '',
    currentAddress: '',
    phoneNumber: '',
    email: '',
    image: null,
    department: '',
    designation: '',
    joiningDate: '',
    employmentType: '',
    supervisor: '',
    role: '',
    educationQualification: '',
  });

  const steps = [
    { id: 1, title: 'Personal Information', icon: User },
    { id: 2, title: 'Employment Details', icon: Briefcase },
    { id: 3, title: 'Education & Review', icon: GraduationCap },
  ];

  const genderOptions = ['Male', 'Female', 'Other'];
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
  const employmentTypeOptions = [
    'fullTime',
    'partTime',
    'Contractual',
    'Temporary',
    'Intern',
  ];
  const departmentOptions = [
    'Information Technology',
    'Human Resources',
    'Finance & Accounts',
    'Marketing',
    'Operations',
    'Sales',
    'Administration',
    'Legal',
    'Research & Development',
  ];

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.DOB) newErrors.DOB = 'Date of birth is required';
      if (!formData.phoneNumber.trim())
        newErrors.phoneNumber = 'Phone number is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.permanentAddress.trim())
        newErrors.permanentAddress = 'Permanent address is required';
    }

    if (step === 2) {
      if (!formData.department) newErrors.department = 'Department is required';
      if (!formData.designation.trim())
        newErrors.designation = 'Designation is required';
      if (!formData.joiningDate)
        newErrors.joiningDate = 'Joining date is required';
      if (!formData.employmentType)
        newErrors.employmentType = 'Employment type is required';
      if (!formData.role.trim())
        newErrors.role = 'Role description is required';
    }

    if (step === 3) {
      if (!formData.educationQualification.trim()) {
        newErrors.educationQualification =
          'Education qualification is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        image: 'Please select a valid image file',
      }));
      return;
    }

    try {
      setIsUploading(true);
      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        imagePath: 'Failed to upload image. Please try again.',
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData((prev) => ({ ...prev, imagePath: '' }));
  };

  const copyPermanentAddress = () => {
    setFormData((prev) => ({ ...prev, currentAddress: prev.permanentAddress }));
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    console.log(formData);

    try {
      setIsSubmitting(true);
      const response = await addStaff(formData);
      console.response;
      const result = response;

      if (result.success) {
        setSubmitSuccess(true);
        setSubmitMessage(result.message);
      }
    } catch (error) {
      setSubmitMessage('Failed to register employee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      gender: '',
      DOB: '',
      nationality: 'Indian',
      maritalStatus: '',
      permanentAddress: '',
      currentAddress: '',
      phoneNumber: '',
      email: '',
      imagePath: '',
      department: '',
      designation: '',
      joiningDate: '',
      employmentType: '',
      supervisor: '',
      role: '',
      educationQualification: '',
    });
    setCurrentStep(1);
    setSubmitSuccess(false);
    setSubmitMessage('');
    setErrors({});
    setImagePreview('');
  };

  const onBack = () => {
    window.history.back();
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">{submitMessage}</p>
          <button
            onClick={resetForm}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Register Another Employee
          </button>
        </div>
      </div>
    );
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {/* Profile Photo Upload */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Camera className="w-5 h-5 mr-2 text-blue-600" />
          Profile Photo
        </h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
              <div className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {isUploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {isUploading ? 'Uploading...' : 'Upload Photo'}
              </div>
            </label>
            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG or GIF (max 5MB)
            </p>
            {errors.imagePath && (
              <p className="text-red-600 text-sm mt-1">{errors.imagePath}</p>
            )}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Basic Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.gender ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select gender</option>
              {genderOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p className="text-red-600 text-sm mt-1">{errors.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              value={formData.DOB}
              onChange={(e) => handleInputChange('DOB', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.DOB ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.DOB && (
              <p className="text-red-600 text-sm mt-1">{errors.DOB}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nationality
            </label>
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter nationality"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marital Status
            </label>
            <select
              value={formData.maritalStatus}
              onChange={(e) =>
                handleInputChange('maritalStatus', e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select marital status</option>
              {maritalStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Phone className="w-5 h-5 mr-2 text-blue-600" />
          Contact Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter phone number"
            />
            {errors.phoneNumber && (
              <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          Address Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permanent Address *
            </label>
            <textarea
              value={formData.permanentAddress}
              onChange={(e) =>
                handleInputChange('permanentAddress', e.target.value)
              }
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.permanentAddress ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter permanent address"
            />
            {errors.permanentAddress && (
              <p className="text-red-600 text-sm mt-1">
                {errors.permanentAddress}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Current Address
              </label>
              <button
                type="button"
                onClick={copyPermanentAddress}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Same as permanent
              </button>
            </div>
            <textarea
              value={formData.currentAddress}
              onChange={(e) =>
                handleInputChange('currentAddress', e.target.value)
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter current address"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmploymentDetails = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
          Employment Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <select
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.department ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select department</option>
              {departmentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="text-red-600 text-sm mt-1">{errors.department}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation *
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => handleInputChange('designation', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.designation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter designation"
            />
            {errors.designation && (
              <p className="text-red-600 text-sm mt-1">{errors.designation}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Joining Date *
            </label>
            <input
              type="date"
              value={formData.joiningDate}
              onChange={(e) => handleInputChange('joiningDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.joiningDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.joiningDate && (
              <p className="text-red-600 text-sm mt-1">{errors.joiningDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Type *
            </label>
            <select
              value={formData.employmentType}
              onChange={(e) =>
                handleInputChange('employmentType', e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.employmentType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select employment type</option>
              {employmentTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.employmentType && (
              <p className="text-red-600 text-sm mt-1">
                {errors.employmentType}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supervisor
            </label>
            <input
              type="text"
              value={formData.supervisor}
              onChange={(e) => handleInputChange('supervisor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter supervisor name"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Role Description
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role & Responsibilities *
          </label>
          <input
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.role ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe the role and key responsibilities"
          />
          {errors.role && (
            <p className="text-red-600 text-sm mt-1">{errors.role}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderEducationAndReview = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
          Education Qualification
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Education Qualification *
          </label>
          <textarea
            value={formData.educationQualification}
            onChange={(e) =>
              handleInputChange('educationQualification', e.target.value)
            }
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.educationQualification
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            placeholder="Enter education qualifications (degree, institution, year, etc.)"
          />
          {errors.educationQualification && (
            <p className="text-red-600 text-sm mt-1">
              {errors.educationQualification}
            </p>
          )}
        </div>
      </div>

      {/* Review Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Review Information
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Personal Details</h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-600">Name:</span>{' '}
                {formData.name || 'Not provided'}
              </p>
              <p>
                <span className="text-gray-600">Gender:</span>{' '}
                {formData.gender || 'Not provided'}
              </p>
              <p>
                <span className="text-gray-600">DOB:</span>{' '}
                {formData.DOB || 'Not provided'}
              </p>
              <p>
                <span className="text-gray-600">Phone:</span>{' '}
                {formData.phoneNumber || 'Not provided'}
              </p>
              <p>
                <span className="text-gray-600">Email:</span>{' '}
                {formData.email || 'Not provided'}
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Employment Details
            </h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-600">Department:</span>{' '}
                {formData.department || 'Not provided'}
              </p>
              <p>
                <span className="text-gray-600">Designation:</span>{' '}
                {formData.designation || 'Not provided'}
              </p>
              <p>
                <span className="text-gray-600">Joining Date:</span>{' '}
                {formData.joiningDate || 'Not provided'}
              </p>
              <p>
                <span className="text-gray-600">Employment Type:</span>{' '}
                {formData.employmentType || 'Not provided'}
              </p>
              <p>
                <span className="text-gray-600">Supervisor:</span>{' '}
                {formData.supervisor || 'Not provided'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderEmploymentDetails();
      case 3:
        return renderEducationAndReview();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div>
          <button
            onClick={onBack}
            className="p-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Employee Registration
          </h1>
          <p className="text-gray-600 mt-2">Add a new employee to the system</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isCompleted
                        ? 'bg-green-600 border-green-600 text-white'
                        : isActive
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        isActive
                          ? 'text-blue-600'
                          : isCompleted
                            ? 'text-green-600'
                            : 'text-gray-500'
                      }`}
                    >
                      Step {step.id}
                    </p>
                    <p
                      className={`text-xs ${
                        isActive
                          ? 'text-blue-600'
                          : isCompleted
                            ? 'text-green-600'
                            : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 ml-4 ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="animate-fade-in">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Register Employee
                </>
              )}
            </button>
          )}
        </div>

        {/* Error Message */}
        {submitMessage && !submitSuccess && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-700">{submitMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEmployee;
