import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Clock, MapPin } from 'lucide-react';
import stateTaxRates from '../data/stateTaxRates.json';
import { convertHourlyToAnnual, convertAnnualToHourly, type FilingStatus } from '../utils/taxCalculations';

interface CalculatorFormData {
  hourlyRate: number;
  annualSalary: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  state: string;
  filingStatus: FilingStatus;
}

interface CalculatorFormProps {
  onCalculate: (data: CalculatorFormData) => void;
  isLoading?: boolean;
}

export default function CalculatorForm({ onCalculate, isLoading = false }: CalculatorFormProps) {
  const [inputMode, setInputMode] = useState<'hourly' | 'salary'>('hourly');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CalculatorFormData>({
    defaultValues: {
      hourlyRate: 25,
      annualSalary: 52000,
      hoursPerWeek: 40,
      weeksPerYear: 52, // Default to full year
      state: 'CA',
      filingStatus: 'single'
    }
  });

  const hourlyRate = watch('hourlyRate');
  const annualSalary = watch('annualSalary');
  const hoursPerWeek = watch('hoursPerWeek');
  const weeksPerYear = watch('weeksPerYear');

  // Sync hourly and salary inputs
  useEffect(() => {
    if (inputMode === 'hourly' && hourlyRate && hoursPerWeek && weeksPerYear) {
      const calculatedSalary = convertHourlyToAnnual(hourlyRate, hoursPerWeek, weeksPerYear);
      setValue('annualSalary', Math.round(calculatedSalary));
    }
  }, [hourlyRate, hoursPerWeek, weeksPerYear, inputMode, setValue]);

  useEffect(() => {
    if (inputMode === 'salary' && annualSalary && hoursPerWeek && weeksPerYear) {
      const calculatedHourly = convertAnnualToHourly(annualSalary, hoursPerWeek, weeksPerYear);
      setValue('hourlyRate', Math.round(calculatedHourly * 100) / 100);
    }
  }, [annualSalary, hoursPerWeek, weeksPerYear, inputMode, setValue]);

  const states = Object.entries(stateTaxRates.states).map(([code, data]) => ({
    code,
    name: data.name
  }));

  const filingStatuses = [
    { value: 'single', label: 'Single' },
    { value: 'marriedJointly', label: 'Married Filing Jointly' },
    { value: 'marriedSeparately', label: 'Married Filing Separately' },
    { value: 'headOfHousehold', label: 'Head of Household' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto relative"
    >
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-3xl scale-105" />

      {/* Main calculator card */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-white to-transparent rounded-full -translate-x-48 -translate-y-48" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-white to-transparent rounded-full translate-x-48 translate-y-48" />
          </div>

          <div className="relative flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30"
            >
              <Calculator className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-3xl font-bold text-white mb-1"
              >
                Smart Wage Calculator
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-blue-100 text-lg"
              >
                Discover your true earning potential
              </motion.p>
            </div>
          </div>
        </div>

        {/* Form content */}
        <div className="p-8">

        <form onSubmit={handleSubmit(onCalculate)} className="space-y-8">
          {/* Input Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative"
          >
            <div className="flex gap-2 p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
              <motion.button
                type="button"
                onClick={() => setInputMode('hourly')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-4 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  inputMode === 'hourly'
                    ? 'bg-white text-blue-600 shadow-lg shadow-blue-100 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Clock className="w-5 h-5 inline mr-2" />
                Hourly Rate
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setInputMode('salary')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-4 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  inputMode === 'salary'
                    ? 'bg-white text-blue-600 shadow-lg shadow-blue-100 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <DollarSign className="w-5 h-5 inline mr-2" />
                Annual Salary
              </motion.button>
            </div>
          </motion.div>

          {/* Primary Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                {inputMode === 'hourly' ? 'Hourly Rate' : 'Annual Salary'}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...register(inputMode === 'hourly' ? 'hourlyRate' : 'annualSalary', {
                    required: 'This field is required',
                    min: { value: 0.01, message: 'Must be greater than 0' }
                  })}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 text-lg font-semibold bg-gradient-to-r from-white to-gray-50 group-hover:border-gray-300"
                  placeholder={inputMode === 'hourly' ? '25.00' : '52,000'}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
              {errors[inputMode === 'hourly' ? 'hourlyRate' : 'annualSalary'] && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <div className="w-1 h-1 bg-red-500 rounded-full" />
                  {errors[inputMode === 'hourly' ? 'hourlyRate' : 'annualSalary']?.message}
                </motion.p>
              )}
            </div>

            {/* Calculated equivalent */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                {inputMode === 'hourly' ? 'Annual Salary' : 'Hourly Rate'}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  value={inputMode === 'hourly' ? annualSalary : hourlyRate}
                  className="w-full pl-12 pr-4 py-4 border-2 border-green-200 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 text-gray-700 text-lg font-semibold cursor-not-allowed"
                  readOnly
                />
                <div className="absolute top-1 right-3 bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                  Auto
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                <div className="w-1 h-1 bg-green-500 rounded-full" />
                Automatically calculated
              </p>
            </div>
          </motion.div>

          {/* Work Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 p-6 rounded-2xl border border-blue-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Work Schedule
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setValue('hoursPerWeek', 40);
                    setValue('weeksPerYear', 52);
                  }}
                  className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                >
                  Full-time
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValue('hoursPerWeek', 40);
                    setValue('weeksPerYear', 50);
                  }}
                  className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
                >
                  + 2 weeks vacation
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
                  Hours per Week
                </label>
                <div className="relative">
                  <input
                    type="number"
                    {...register('hoursPerWeek', {
                      required: 'Hours per week is required',
                      min: { value: 1, message: 'Must be at least 1 hour' },
                      max: { value: 168, message: 'Cannot exceed 168 hours per week' }
                    })}
                    className="w-full px-4 py-4 border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all duration-300 text-lg font-semibold bg-gradient-to-r from-white to-orange-50 group-hover:border-orange-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
                {errors.hoursPerWeek && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-500 text-sm mt-2 flex items-center gap-1"
                  >
                    <div className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.hoursPerWeek.message}
                  </motion.p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  Weeks per Year
                  <div className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full ml-auto">
                    Usually 52
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    {...register('weeksPerYear', {
                      required: 'Weeks per year is required',
                      min: { value: 1, message: 'Must be at least 1 week' },
                      max: { value: 52, message: 'Cannot exceed 52 weeks' }
                    })}
                    className="w-full px-4 py-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 text-lg font-semibold bg-gradient-to-r from-white to-purple-50 group-hover:border-purple-300"
                    placeholder="52"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <p className="text-xs text-purple-600 mt-2 font-medium flex items-center gap-1">
                  <div className="w-1 h-1 bg-purple-500 rounded-full" />
                  Adjust only for vacation time or seasonal work
                </p>
                {errors.weeksPerYear && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-500 text-sm mt-2 flex items-center gap-1"
                  >
                    <div className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.weeksPerYear.message}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>

          {/* State and Filing Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-gradient-to-r from-indigo-50/50 to-blue-50/50 p-6 rounded-2xl border border-indigo-100"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              Tax Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" />
                  State
                </label>
                <div className="relative">
                  <select
                    {...register('state', { required: 'State is required' })}
                    className="w-full px-4 py-4 border-2 border-indigo-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-300 text-lg font-semibold bg-gradient-to-r from-white to-indigo-50 group-hover:border-indigo-300 appearance-none cursor-pointer"
                  >
                    {states.map(state => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-2 h-2 border-r-2 border-b-2 border-indigo-400 transform rotate-45" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
                {errors.state && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-500 text-sm mt-2 flex items-center gap-1"
                  >
                    <div className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.state.message}
                  </motion.p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" />
                  Filing Status
                </label>
                <div className="relative">
                  <select
                    {...register('filingStatus', { required: 'Filing status is required' })}
                    className="w-full px-4 py-4 border-2 border-teal-200 rounded-xl focus:ring-4 focus:ring-teal-100 focus:border-teal-400 transition-all duration-300 text-lg font-semibold bg-gradient-to-r from-white to-teal-50 group-hover:border-teal-300 appearance-none cursor-pointer"
                  >
                    {filingStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-2 h-2 border-r-2 border-b-2 border-teal-400 transform rotate-45" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
                {errors.filingStatus && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-500 text-sm mt-2 flex items-center gap-1"
                  >
                    <div className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.filingStatus.message}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="pt-4"
          >
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-6 px-8 rounded-2xl font-bold text-xl shadow-2xl shadow-blue-200 hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Button content */}
              <div className="relative flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                    />
                    <span>Calculating Your Worth...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-6 h-6" />
                    <span>Calculate My Take-Home Pay</span>
                    <motion.div
                      className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center ml-2"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="w-2 h-2 border-r-2 border-b-2 border-white transform rotate-45" />
                    </motion.div>
                  </>
                )}
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
            </motion.button>
          </motion.div>
        </form>
        </div>
      </div>
    </motion.div>
  );
}
