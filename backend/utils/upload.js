const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_API_URL,
  process.env.SUPABASE_API_KEY
);
const storageName = "user-data";

function uploadToCloud(file, filename) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase.storage
      .from(storageName)
      .upload(filename, file);
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
