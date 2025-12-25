import { BaseService } from './base.service';
import { CRISIS_HOTLINES } from '@/constants/tests/phq9-questions';

export interface CrisisAlertData {
  testType: string;
  severityLevel: string;
  crisisReason: string;
  totalScore: number;
  question9Score?: number;
}

export interface CrisisAlertResponse {
  success: boolean;
  message: string;
  data?: {
    alertId: string;
    hotlines: typeof CRISIS_HOTLINES;
    emergencyContact?: {
      name: string;
      phone: string;
    };
  };
  error?: string;
}

export class CrisisAlertService extends BaseService {
  /**
   * Submit a crisis alert
   */
  async submitCrisisAlert(data: CrisisAlertData): Promise<CrisisAlertResponse> {
    try {
      const response = await fetch('/api/crisis-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Không thể gửi cảnh báo',
          error: result.error,
        };
      }
      return result;
    } catch (error) {
      console.error('Error submitting crisis alert:', error);
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi gửi cảnh báo',
        error: 'Network Error',
      };
    }
  }

  /**
   * Get crisis alerts for mentors/admins
   */
  async getCrisisAlerts(options?: {
    status?: 'pending' | 'acknowledged' | 'in_progress' | 'resolved';
    limit?: number;
  }) {
    try {
      const params = new URLSearchParams();
      if (options?.status) params.append('status', options.status);
      if (options?.limit) params.append('limit', options.limit.toString());

      const response = await fetch(`/api/crisis-alert?${params.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch alerts');
      }
      return result.data;
    } catch (error) {
      console.error('Error fetching crisis alerts:', error);
      return [];
    }
  }

  /**
   * Update crisis alert status
   */
  async updateCrisisAlertStatus(
    alertId: string,
    data: {
      status: 'acknowledged' | 'in_progress' | 'resolved';
      notes?: string;
      followUpDate?: string;
    }
  ) {
    try {
      const response = await fetch(`/api/crisis-alert/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update alert');
      }
      return result;
    } catch (error) {
      console.error('Error updating crisis alert:', error);
      throw error;
    }
  }

  /**
   * Get crisis alert details
   */
  async getCrisisAlertDetails(alertId: string) {
    try {
      const response = await fetch(`/api/crisis-alert/${alertId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch alert details');
      }
      return result.data;
    } catch (error) {
      console.error('Error fetching crisis alert details:', error);
      throw error;
    }
  }

  /**
   * Check if test result should trigger crisis alert
   */
  shouldTriggerCrisisAlert(
    testType: string,
    result: {
      totalScore?: number;
      crisisFlag?: boolean;
      question9Score?: number;
      severityLevel?: string;
    }
  ): boolean {
    if (testType === 'PHQ9') {
      if (result.question9Score && result.question9Score > 0) return true;
      if (result.totalScore && result.totalScore >= 15) return true;
      if (result.crisisFlag) return true;
    }
    if (testType === 'GAD7') {
      if (result.totalScore && result.totalScore >= 15) return true;
    }
    if (testType === 'DASS21') {
      if (result.severityLevel === 'extremely_severe' || result.severityLevel === 'severe') {
        return true;
      }
    }
    return result.crisisFlag || false;
  }

  getPrimaryCrisisHotline() {
    return CRISIS_HOTLINES.find(h => (h as any).isPrimary) || CRISIS_HOTLINES[0];
  }

  formatPhoneLink(phone: string): string {
    return `tel:${phone.replace(/\s+/g, '')}`;
  }
}

export const crisisAlertService = new CrisisAlertService();

export const submitCrisisAlert = (data: CrisisAlertData) => crisisAlertService.submitCrisisAlert(data);
export const getCrisisAlerts = (options?: any) => crisisAlertService.getCrisisAlerts(options);
export const updateCrisisAlertStatus = (id: string, data: any) => crisisAlertService.updateCrisisAlertStatus(id, data);
export const getCrisisAlertDetails = (id: string) => crisisAlertService.getCrisisAlertDetails(id);
export const shouldTriggerCrisisAlert = (type: string, res: any) => crisisAlertService.shouldTriggerCrisisAlert(type, res);
export const getPrimaryCrisisHotline = () => crisisAlertService.getPrimaryCrisisHotline();
export const formatPhoneLink = (phone: string) => crisisAlertService.formatPhoneLink(phone);
