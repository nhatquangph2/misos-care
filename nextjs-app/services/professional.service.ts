import { BaseService } from './base.service';
import { User, MentorRelationship } from '@/types/database';

export interface ClientSummary {
    relationshipId: string;
    client: User;
    status: MentorRelationship['status'];
    lastInteraction_at: string | null;
    started_at: string | null;
}

export class ProfessionalService extends BaseService {
    /**
     * Get list of clients for the current professional (mentor)
     */
    async getClients(mentorId: string): Promise<ClientSummary[]> {
        const { data, error } = await this.supabase
            .from('mentor_relationships')
            .select(`
        id,
        status,
        started_at,
        updated_at,
        client:users!user_id (
          id,
          name,
          email,
          avatar_url,
          last_sign_in_at
        )
      `)
            .eq('mentor_id', mentorId)
            .neq('status', 'cancelled'); // Show active, pending, or completed

        if (error) {
            console.error('Error fetching clients:', error);
            return [];
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.map((item: any) => ({
            relationshipId: item.id,
            client: item.client,
            status: item.status,
            lastInteraction_at: item.updated_at,
            started_at: item.started_at
        }));
    }

    /**
     * Get comprehensive details for a specific client
     * Includes profile, test history, and MISO analysis
     */
    async getClientDetails(clientId: string) {
        // Parallel fetch for efficiency
        const [userRes, misoRes, unifiedRes] = await Promise.all([
            this.supabase.from('users').select('*').eq('id', clientId).single(),
            this.supabase.from('miso_analysis_logs').select('*').eq('user_id', clientId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
            // We can reuse UnifiedProfileService logic or fetch raw here. 
            // For now, let's just get the raw unified profile if available
            this.supabase.from('personality_profiles').select('*').eq('user_id', clientId).maybeSingle()
        ]);

        return {
            user: userRes.data,
            misoAnalysis: misoRes.data,
            legacyProfile: unifiedRes.data
        };
    }
}

export const professionalService = new ProfessionalService();
