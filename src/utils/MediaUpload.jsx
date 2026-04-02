import {createClient} from '@supabase/supabase-js';

const anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkaXFvdHJja2dsdmVia3NjeW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDUyMTksImV4cCI6MjA1ODQ4MTIxOX0.tUhHu75fv1FrhZ2-dcSYtWqVsv6dSaNJCkDwdivRhxM";

const supabse_url = "https://adiqotrckglvebkscymn.supabase.co";

const supabase = createClient(supabse_url,anon_key);

export default function MediaUpload(file){
    return new Promise((resolve,reject)=>{
        if(file === null){
            reject("No file selected!")
        }else{
            const timeStamp = new Date().getTime();
            const fileName = timeStamp+file.name;

            supabase.storage.from("images").upload(fileName,file,{
                cacheControl:'3600',
                upsert:false
            }).then(()=>{
                const pulicUrl = supabase.storage.from("images").getPublicUrl(fileName).data.publicUrl;
                resolve(pulicUrl);
            }).catch((error)=>{
                reject("Error uploading file!");
            })
        }
    });
}