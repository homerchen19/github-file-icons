import { Source } from "webpack-sources";
import "./declarations";

export type SourceFactory = (...sources: Array<string | Source>) => Source;
