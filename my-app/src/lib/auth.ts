import {supabase} from "./supabase";
import type { Session } from "@supabase/supabase-js";


//For sign in
export async function signIn(email:string,password:string){
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

//For registering
export async function signUp(email:string, password: string){
    const {data,error} = await supabase.auth.signUp({
        email:email,
        password: password
    })
    if (error) throw error;
    return data;
}

//logout
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

//Gets the user
export async function getCurrentUser(){
    //This grabs user inside data
    const {data:{user}, error} = await supabase.auth.getUser();
    if (error) throw error;
    return user
}

//gets session
export async function getSession(){
    const {data:{session},error} = await supabase.auth.getSession();
    if(error) throw error
    return session
}

//We use this function to constantly check the session making sure that the user is allowed
//For example if user opens another tab and logs out of that tab then the original tab will also log out
/*
export function onAuthchange(callback:(session: Session|null)=>void){
    const {data:{subscription}} = supabase.auth.onAuthStateChange(
        (_event,session)=>callback(session)
    )
    return ()=>subscription.unsubscribe();
}
*/ 

