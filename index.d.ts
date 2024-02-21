// Global definition
import * as _ from "lodash";
import * as moment from "moment";

declare global {
  // 他の設定は省略
  const _: _.LoDashStatic;
  // const $: JQueryStatic // jqueryはすでにGlobalに定義済み
  const moment: moment.MomentStatic;
  interface Window {
    // W <= 大文字, Window Classの方を拡張する
    $: JQueryStatic;
    _: _.LoDashStatic;
    moment: moment.Moment;
  }
  const fp: fp.lodashFp;
  interface Window {
    fp: fp.lodashFp;
  }
}
