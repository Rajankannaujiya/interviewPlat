import { atom } from "recoil";


const authAtom = atom({
    key: "authentication",
    default: {
        authenticated:false,
        token: null as string | null,
        user:
    }
})