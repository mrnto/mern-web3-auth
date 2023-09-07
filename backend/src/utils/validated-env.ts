import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
    JWT_EXPIRATION: str({ default: "1h" }),
    JWT_SECRET: str({ default: "b71f13fcdb452481b2ed4e458f13747fac67f28789a1ee26f596d496dfe2f6d13e142722ea10160edab13542f3e3e9f1d7c7d2565804cdde1832f650e4c0f20a" }),
    MONGO_CONNECTION_STRING: str(),
    NODE_ENV: str({ default: "development" }),
    PORT: port({ default: 3000 }),
});
