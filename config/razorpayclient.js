import Razorpay from "razorpay";

const keyid="rzp_test_pUAhXMeSIpSuES"
const keysecret="NLNOV4xGZsp2TdUAX8epIEdE"

const razorpay = new Razorpay({
    key_id: keyid,
    key_secret: keysecret,
  });
export default razorpay
  