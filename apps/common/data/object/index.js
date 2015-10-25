import NativeDataObject from "./native";
import PollyDataObject  from "./polly";

export default (!!Object.observe ? PollyDataObject : PollyDataObject);
