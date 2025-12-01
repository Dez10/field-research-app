export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          organization: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          organization?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          organization?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      specimens: {
        Row: {
          id: string
          project_id: string
          specimen_number: string
          qr_code: string | null
          common_name: string | null
          scientific_name: string | null
          family: string | null
          genus: string | null
          species: string | null
          verified: boolean
          latitude: number | null
          longitude: number | null
          altitude: number | null
          accuracy: number | null
          location_description: string | null
          habitat: string | null
          soil_type: string | null
          slope: string | null
          aspect: string | null
          measurements: Json | null
          photos: string[] | null
          collected_by: string
          collected_date: string
          modified_date: string
          notes: string | null
          tags: string[] | null
          sync_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          specimen_number: string
          qr_code?: string | null
          common_name?: string | null
          scientific_name?: string | null
          family?: string | null
          genus?: string | null
          species?: string | null
          verified?: boolean
          latitude?: number | null
          longitude?: number | null
          altitude?: number | null
          accuracy?: number | null
          location_description?: string | null
          habitat?: string | null
          soil_type?: string | null
          slope?: string | null
          aspect?: string | null
          measurements?: Json | null
          photos?: string[] | null
          collected_by: string
          collected_date?: string
          modified_date?: string
          notes?: string | null
          tags?: string[] | null
          sync_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          specimen_number?: string
          qr_code?: string | null
          common_name?: string | null
          scientific_name?: string | null
          family?: string | null
          genus?: string | null
          species?: string | null
          verified?: boolean
          latitude?: number | null
          longitude?: number | null
          altitude?: number | null
          accuracy?: number | null
          location_description?: string | null
          habitat?: string | null
          soil_type?: string | null
          slope?: string | null
          aspect?: string | null
          measurements?: Json | null
          photos?: string[] | null
          collected_by?: string
          collected_date?: string
          modified_date?: string
          notes?: string | null
          tags?: string[] | null
          sync_status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
