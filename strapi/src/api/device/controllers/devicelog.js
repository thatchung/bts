const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Mongodb = __importDefault(require("../plugin/mongodb"));
module.exports = {
  async getLogData(ctx, next) {
    let { id } = ctx.request.query;
    let list = []
    let query = {}
    if (id) {
      query.id = id
    }
    await Mongodb.default.callAction(async (client) => {
      const dbo = client.db("admin");
      list = await dbo.collection('solar_history').find(query).sort({time:-1}).limit(10).toArray();
      await client.close();
    })
    ctx.send({
      data : list
    });
  },
};