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
      clients: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          document: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          document: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          document?: string
          updated_at?: string
        }
      }
      service_orders: {
        Row: {
          id: string
          client_id: string
          product_id: string
          status: 'pending' | 'active' | 'suspended' | 'cancelled'
          price: number
          setup_fee?: number
          billing_cycle: 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'biennial'
          next_due_date: string
          notes?: string
          custom_fields?: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          product_id: string
          status?: 'pending' | 'active' | 'suspended' | 'cancelled'
          price: number
          setup_fee?: number
          billing_cycle: 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'biennial'
          next_due_date: string
          notes?: string
          custom_fields?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          product_id?: string
          status?: 'pending' | 'active' | 'suspended' | 'cancelled'
          price?: number
          setup_fee?: number
          billing_cycle?: 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'biennial'
          next_due_date?: string
          notes?: string
          custom_fields?: Json
          updated_at?: string
        }
      }
      service_products: {
        Row: {
          id: string
          name: string
          description: string
          group_id: string
          price: number
          setup_fee?: number
          billing_cycle: 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'biennial'
          is_active: boolean
          features: string[]
          stock_control: boolean
          stock_quantity?: number
          auto_setup: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          group_id: string
          price: number
          setup_fee?: number
          billing_cycle: 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'biennial'
          is_active?: boolean
          features?: string[]
          stock_control?: boolean
          stock_quantity?: number
          auto_setup?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string
          group_id?: string
          price?: number
          setup_fee?: number
          billing_cycle?: 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'biennial'
          is_active?: boolean
          features?: string[]
          stock_control?: boolean
          stock_quantity?: number
          auto_setup?: boolean
          updated_at?: string
        }
      }
      service_groups: {
        Row: {
          id: string
          name: string
          description?: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string
          is_active?: boolean
          updated_at?: string
        }
      }
    }
  }
}
