// Supabase schema types (picked up automatically by @nuxtjs/supabase).
// Can be replaced with generated types: `npx supabase gen types typescript`.
type Loose = Record<string, unknown>;

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'super_admin' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'super_admin' | 'admin';
          created_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          role?: 'super_admin' | 'admin';
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          type: 'invoice' | 'quotation' | 'payslip';
          number: string;
          // shape is defined by DocData in app/utils/documents.ts
          data: unknown;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: 'invoice' | 'quotation' | 'payslip';
          number: string;
          data: unknown;
          created_by?: string | null;
        };
        Update: {
          number?: string;
          data?: unknown;
        };
        Relationships: [];
      };
      projects: {
        Row: Loose;
        Insert: Loose;
        Update: Loose;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      next_document_number: {
        Args: { doc_type: string };
        Returns: string;
      };
      is_admin: { Args: Record<never, never>; Returns: boolean };
      is_super_admin: { Args: Record<never, never>; Returns: boolean };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}
