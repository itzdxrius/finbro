import {supabase} from "./supabase";


//For sign in
export async function signIn(email:string,password:string){
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

export async function signUp(email:string, password: string){
    
}

