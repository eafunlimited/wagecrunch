import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Trash2, Edit3, Clock, DollarSign, MapPin, Star, Lock, Plus } from 'lucide-react';
import { getSavedCalculations, saveCalculation, deleteCalculation, updateCalculationName, type SavedCalculation } from '../utils/savedCalculations';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import stateTaxRates from '../data/stateTaxRates.json';

interface SavedCalculationsProps {
  currentCalculation?: {
    name?: string;
    data: SavedCalculation['data'];
  };
  isPremium: boolean;
  onUpgrade: () => void;
  onLoadCalculation: (calculation: SavedCalculation['data']) => void;
}

export default function SavedCalculations({
  currentCalculation,
  isPremium,
  onUpgrade,
  onLoadCalculation
}: SavedCalculationsProps) {
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    setSavedCalculations(getSavedCalculations());
  }, []);

  const handleSaveCurrentCalculation = async () => {
    if (!currentCalculation) return;

    setIsSaving(true);
    setSaveError('');

    const calculationName = currentCalculation.name ||
      `${formatCurrency(currentCalculation.data.grossIncome, 0)} - ${getStateName(currentCalculation.data.state)}`;

    const result = saveCalculation({
      name: calculationName,
      data: currentCalculation.data
    }, isPremium);

    if (result.success) {
      setSavedCalculations(getSavedCalculations());
    } else {
      setSaveError(result.error || 'Failed to save calculation');
      if (!isPremium && result.error?.includes('Upgrade')) {
        setTimeout(() => onUpgrade(), 2000);
      }
    }

    setIsSaving(false);
  };

  const handleDelete = (id: string) => {
    if (deleteCalculation(id)) {
      setSavedCalculations(getSavedCalculations());
    }
  };

  const handleRename = (id: string, newName: string) => {
    if (updateCalculationName(id, newName)) {
      setSavedCalculations(getSavedCalculations());
      setEditingId(null);
    }
  };

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const getStateName = (stateCode: string) => {
    return stateTaxRates.states[stateCode as keyof typeof stateTaxRates.states]?.name || stateCode;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Save className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Saved Calculations</h3>
                <p className="text-blue-100">Track and compare your salary calculations</p>
              </div>
            </div>
            {isPremium && (
              <div className="flex items-center gap-2 bg-yellow-400/20 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-300" />
                <span className="text-yellow-100 font-semibold text-sm">Premium</span>
              </div>
            )}
          </div>
        </div>

        {/* Save Current Calculation */}
        {currentCalculation && (
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Save Current Calculation</h4>
                <p className="text-gray-600 text-sm">
                  {formatCurrency(currentCalculation.data.grossIncome)} •
                  {formatPercentage(currentCalculation.data.effectiveTaxRate)} effective rate •
                  {getStateName(currentCalculation.data.state)}
                </p>
              </div>

              <motion.button
                onClick={handleSaveCurrentCalculation}
                disabled={isSaving}
                whileHover={isPremium ? { scale: 1.05 } : {}}
                whileTap={isPremium ? { scale: 0.95 } : {}}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  isPremium
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
              >
                {!isPremium && <Lock className="w-4 h-4" />}
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Save
                  </>
                )}
              </motion.button>
            </div>

            {saveError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-700 text-sm">{saveError}</p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Saved Calculations List */}
      <div className="space-y-4">
        <AnimatePresence>
          {savedCalculations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Save className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Saved Calculations</h4>
              <p className="text-gray-600 mb-4">
                Save your calculations to compare scenarios and track your progress.
              </p>
              {!isPremium && (
                <button
                  onClick={onUpgrade}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Star className="w-4 h-4" />
                  Upgrade to Save Calculations
                </button>
              )}
            </motion.div>
          ) : (
            savedCalculations.map((calculation, index) => (
              <motion.div
                key={calculation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Name */}
                    <div className="flex items-center gap-3 mb-3">
                      {editingId === calculation.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 px-3 py-1 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-100"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRename(calculation.id, editName);
                              if (e.key === 'Escape') cancelEdit();
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleRename(calculation.id, editName)}
                            className="text-green-600 hover:text-green-700"
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <h4 className="text-lg font-semibold text-gray-900 flex-1">
                            {calculation.name}
                          </h4>
                          <button
                            onClick={() => startEdit(calculation.id, calculation.name)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-medium text-green-700">Take-Home</span>
                        </div>
                        <p className="font-bold text-green-900">
                          {formatCurrency(calculation.data.netIncome, 0)}
                        </p>
                      </div>

                      <div className="bg-red-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-red-700">Tax Rate</span>
                        </div>
                        <p className="font-bold text-red-900">
                          {formatPercentage(calculation.data.effectiveTaxRate)}
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-blue-700">State</span>
                        </div>
                        <p className="font-bold text-blue-900 text-sm">
                          {getStateName(calculation.data.state)}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="text-xs font-medium text-gray-700">Saved</span>
                        </div>
                        <p className="font-bold text-gray-900 text-sm">
                          {new Date(calculation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <motion.button
                      onClick={() => onLoadCalculation(calculation.data)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Load
                    </motion.button>

                    <motion.button
                      onClick={() => handleDelete(calculation.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Premium Upsell */}
      {!isPremium && savedCalculations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">
                ⭐ Upgrade to Premium for More Saves
              </h4>
              <p className="text-yellow-700 text-sm">
                Free users: 3 saved calculations • Premium users: 25 saved calculations
              </p>
            </div>
            <button
              onClick={onUpgrade}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
            >
              Upgrade Now
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
