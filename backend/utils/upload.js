const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.API_URL, process.env.API_KEY);
const storageName = "user-data";

async function uploadToCloud(file, filename) {
  const { data, error } = await supabase.storage
    .from(storageName)
    .upload(filename, file);

  return new Promise((resolve, reject) => {
    if (error) {
      reject(error);
    } else if (data) {
      const { data } = supabase.storage
        .from(storageName)
        .getPublicUrl(filename);
      resolve(data.publicUrl);
    }
  });
}

module.exports = uploadToCloud;
