// Node.js 23+ removed several long-deprecated `util` helpers (DEP0047, DEP0060).
// ssh2/ssh2-streams read `util.isDate` (and use `util._extend`) when their
// modules load, so on newer VS Code / Cursor builds the SFTP client breaks.
// Restore them before anything requires ssh2. This must stay the first import
// in extension.ts.
import * as util from 'util';

const nodeUtil = util as any;

if (typeof nodeUtil.isDate !== 'function') {
  nodeUtil.isDate = (d: any): boolean => {
    return d instanceof Date;
  };
}

if (typeof nodeUtil._extend !== 'function') {
  nodeUtil._extend = (target: any, source: any): any => {
    return Object.assign(target, source);
  };
}
