import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          phone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          updated_at?: string
        }
      }
      repairs: {
        Row: {
          id: string
          repair_number: string
          customer_id: string
          device_type: string
          device_model: string
          customer_problem: string
          inspection_result?: string
          repair_notes?: string
          repair_cost?: number
          discount?: number
          total_amount?: number
          paid_amount?: number
          remaining_amount?: number
          status: 'received' | 'inspection' | 'waiting_approval' | 'approved' | 'in_repair' | 'ready' | 'delivered' | 'rejected' | 'cancelled'
          expected_delivery_date?: string
          received_at: string
          delivered_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          repair_number?: string
          customer_id: string
          device_type: string
          device_model: string
          customer_problem: string
          inspection_result?: string
          repair_notes?: string
          repair_cost?: number
          discount?: number
          total_amount?: number
          paid_amount?: number
          remaining_amount?: number
          status?: 'received' | 'inspection' | 'waiting_approval' | 'approved' | 'in_repair' | 'ready' | 'delivered' | 'rejected' | 'cancelled'
          expected_delivery_date?: string
          received_at?: string
          delivered_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          repair_number?: string
          customer_id?: string
          device_type?: string
          device_model?: string
          customer_problem?: string
          inspection_result?: string
          repair_notes?: string
          repair_cost?: number
          discount?: number
          total_amount?: number
          paid_amount?: number
          remaining_amount?: number
          status?: 'received' | 'inspection' | 'waiting_approval' | 'approved' | 'in_repair' | 'ready' | 'delivered' | 'rejected' | 'cancelled'
          expected_delivery_date?: string
          delivered_at?: string
          updated_at?: string
        }
      }
      repair_photos: {
        Row: {
          id: string
          repair_id: string
          photo_type: 'reception' | 'delivery'
          file_path: string
          created_at: string
        }
        Insert: {
          id?: string
          repair_id: string
          photo_type: 'reception' | 'delivery'
          file_path: string
          created_at?: string
        }
        Update: {
          id?: string
          repair_id?: string
          photo_type?: 'reception' | 'delivery'
          file_path?: string
        }
      }
      repair_status_history: {
        Row: {
          id: string
          repair_id: string
          status: string
          notes?: string
          created_at: string
        }
        Insert: {
          id?: string
          repair_id: string
          status: string
          notes?: string
          created_at?: string
        }
        Update: {
          id?: string
          repair_id?: string
          status?: string
          notes?: string
        }
      }
      payments: {
        Row: {
          id: string
          repair_id: string
          amount: number
          payment_method: 'نقدي' | 'فودافون كاش' | 'إنستاباي' | 'تحويل بنكي' | 'أخرى'
          notes?: string
          created_at: string
        }
        Insert: {
          id?: string
          repair_id: string
          amount: number
          payment_method: 'نقدي' | 'فودافون كاش' | 'إنستاباي' | 'تحويل بنكي' | 'أخرى'
          notes?: string
          created_at?: string
        }
        Update: {
          id?: string
          repair_id?: string
          amount?: number
          payment_method?: 'نقدي' | 'فودافون كاش' | 'إنستاباي' | 'تحويل بنكي' | 'أخرى'
          notes?: string
        }
      }
    }
  }
}
