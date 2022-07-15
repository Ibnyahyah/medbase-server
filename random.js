import crypto from "crypto";

const result = crypto.randomBytes(64).toString("hex");
console.log(result);
