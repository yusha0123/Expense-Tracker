const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.API_URL, process.env.API_KEY);

async function uploadToCloud(file, filename) {
  const { data, error } = await supabase.storage
    .from("user-data")
    .upload(filename, file);

  return new Promise((resolve, reject) => {
    if (error) {
      reject("Failed to upload to supabase!");
    } else if (data) {
      resolve(data);
    }
  });
}

module.exports = uploadToCloud;
