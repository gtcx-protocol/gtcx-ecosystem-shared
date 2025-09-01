/**
 * Gold Lot Registration ViewModel
 * Presentation layer logic for gold lot registration workflow
 */

import { useState, useEffect, useCallback } from 'react';
import GoldLotRegistrationService, { 
  GoldLotRegistrationData, 
  WorkflowStep 
} from '../domain/GoldLotRegistrationService';

export interface GoldLotRegistrationState {
  // Form data
  data: Partial<GoldLotRegistrationData>;
  
  // UI state
  currentStep: number;
  isLoading: boolean;
  isSubmitting: boolean;
  errors: string[];
  
  // Workflow state
  workflowSteps: WorkflowStep[];
  progress: number;
  completedSteps: string[];
  nextStep: string | null;
  
  // Location state
  isCapturingLocation: boolean;
  locationError: string | null;
  
  // Photo state
  photos: string[];
  isCapturingPhoto: boolean;
  
  // Submission state
  submissionResult: any | null;
  submissionError: string | null;
}

export interface GoldLotRegistrationActions {
  // Navigation actions
  goToStep: (stepIndex: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  // Form actions
  updateData: (updates: Partial<GoldLotRegistrationData>) => void;
  clearForm: () => void;
  
  // Location actions
  captureLocation: () => Promise<void>;
  clearLocationError: () => void;
  
  // Photo actions
  addPhoto: (photoUri: string) => void;
  removePhoto: (index: number) => void;
  capturePhoto: () => Promise<void>;
  
  // Validation actions
  validateCurrentStep: () => boolean;
  validateForm: () => { isValid: boolean; errors: string[] };
  
  // Submission actions
  submitRegistration: () => Promise<void>;
  clearSubmissionError: () => void;
}

export function useGoldLotRegistrationViewModel(
  service: GoldLotRegistrationService,
  minerId: string
): [GoldLotRegistrationState, GoldLotRegistrationActions] {
  // State initialization
  const [state, setState] = useState<GoldLotRegistrationState>({
    data: { minerId },
    currentStep: 0,
    isLoading: false,
    isSubmitting: false,
    errors: [],
    workflowSteps: service.getWorkflowSteps(),
    progress: 0,
    completedSteps: [],
    nextStep: null,
    isCapturingLocation: false,
    locationError: null,
    photos: [],
    isCapturingPhoto: false,
    submissionResult: null,
    submissionError: null,
  });

  // Update progress whenever data changes
  useEffect(() => {
    const progressInfo = service.calculateProgress(state.data);
    setState(prev => ({
      ...prev,
      progress: progressInfo.percentage,
      completedSteps: progressInfo.completedSteps,
      nextStep: progressInfo.nextStep,
      workflowSteps: prev.workflowSteps.map(step => ({
        ...step,
        isCompleted: progressInfo.completedSteps.includes(step.id),
      })),
    }));
  }, [state.data, service]);

  // Actions implementation
  const actions: GoldLotRegistrationActions = {
    // Navigation actions
    goToStep: useCallback((stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < state.workflowSteps.length) {
        setState(prev => ({ ...prev, currentStep: stepIndex }));
      }
    }, [state.workflowSteps.length]),

    nextStep: useCallback(() => {
      if (state.currentStep < state.workflowSteps.length - 1) {
        setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
      }
    }, [state.currentStep, state.workflowSteps.length]),

    previousStep: useCallback(() => {
      if (state.currentStep > 0) {
        setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
      }
    }, [state.currentStep]),

    // Form actions
    updateData: useCallback((updates: Partial<GoldLotRegistrationData>) => {
      setState(prev => ({
        ...prev,
        data: { ...prev.data, ...updates },
        errors: [], // Clear errors when data is updated
      }));
    }, []),

    clearForm: useCallback(() => {
      setState(prev => ({
        ...prev,
        data: { minerId },
        currentStep: 0,
        errors: [],
        photos: [],
        submissionResult: null,
        submissionError: null,
      }));
    }, [minerId]),

    // Location actions
    captureLocation: useCallback(async () => {
      setState(prev => ({ ...prev, isCapturingLocation: true, locationError: null }));
      
      try {
        const location = await service.captureHighAccuracyLocation();
        setState(prev => ({
          ...prev,
          data: { ...prev.data, location },
          isCapturingLocation: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isCapturingLocation: false,
          locationError: error instanceof Error ? error.message : 'Failed to capture location',
        }));
      }
    }, [service]),

    clearLocationError: useCallback(() => {
      setState(prev => ({ ...prev, locationError: null }));
    }, []),

    // Photo actions
    addPhoto: useCallback((photoUri: string) => {
      setState(prev => ({
        ...prev,
        photos: [...prev.photos, photoUri],
        data: {
          ...prev.data,
          photos: [...(prev.data.photos || []), photoUri],
        },
      }));
    }, []),

    removePhoto: useCallback((index: number) => {
      setState(prev => {
        const newPhotos = prev.photos.filter((_, i) => i !== index);
        return {
          ...prev,
          photos: newPhotos,
          data: {
            ...prev.data,
            photos: newPhotos,
          },
        };
      });
    }, []),

    capturePhoto: useCallback(async () => {
      setState(prev => ({ ...prev, isCapturingPhoto: true }));
      
      try {
        // This would integrate with camera service
        // For now, we'll simulate photo capture
        const photoUri = `photo_${Date.now()}.jpg`;
        setState(prev => ({
          ...prev,
          photos: [...prev.photos, photoUri],
          data: {
            ...prev.data,
            photos: [...(prev.data.photos || []), photoUri],
          },
          isCapturingPhoto: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isCapturingPhoto: false,
          errors: [...prev.errors, 'Failed to capture photo'],
        }));
      }
    }, []),

    // Validation actions
    validateCurrentStep: useCallback(() => {
      const currentStepId = state.workflowSteps[state.currentStep]?.id;
      
      switch (currentStepId) {
        case 'location':
          return !!(state.data.location?.latitude && 
                   state.data.location?.longitude && 
                   state.data.location?.accuracy && 
                   state.data.location.accuracy <= 10);
        
        case 'photos':
          return !!(state.data.photos && state.data.photos.length >= 2);
        
        case 'details':
          return !!(state.data.goldDetails?.estimatedQuantity && 
                   state.data.goldDetails?.purity && 
                   state.data.goldDetails?.form && 
                   state.data.goldDetails?.color &&
                   state.data.discoveryDate);
        
        case 'verification':
          return state.completedSteps.length === 3;
        
        default:
          return false;
      }
    }, [state.currentStep, state.workflowSteps, state.data, state.completedSteps]),

    validateForm: useCallback(() => {
      return service.validateRegistrationData(state.data);
    }, [service, state.data]),

    // Submission actions
    submitRegistration: useCallback(async () => {
      setState(prev => ({ ...prev, isSubmitting: true, submissionError: null }));
      
      try {
        // Final validation
        const validation = service.validateRegistrationData(state.data);
        if (!validation.isValid) {
          throw new Error(validation.errors.join(', '));
        }

        // Submit registration
        const result = await service.registerGoldLot(state.data as GoldLotRegistrationData);
        
        setState(prev => ({
          ...prev,
          isSubmitting: false,
          submissionResult: result,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isSubmitting: false,
          submissionError: error instanceof Error ? error.message : 'Registration failed',
        }));
      }
    }, [service, state.data]),

    clearSubmissionError: useCallback(() => {
      setState(prev => ({ ...prev, submissionError: null }));
    }, []),
  };

  return [state, actions];
}

export default useGoldLotRegistrationViewModel;