export default function handler(req, res) {
  res.status(200).json({
    status: true,
    owner: "Sean Phiri",
    bot: "VIPER.XTG",
    message: "Session generator ready"
  });
}
