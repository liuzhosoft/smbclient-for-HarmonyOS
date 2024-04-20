export enum SMBDialect {
  UNKNOWN = 0x0,
  SMB_2_0_2 = 0x0202,
  SMB_2_1 = 0x0210,
  SMB_2XX = 0x02FF,
  SMB_3_0 = 0x0300,
  SMB_3_0_2 = 0x0302,
  SMB_3_1_1 = 0x0311,
}

export namespace SMBDialectUtil {
  export function isSmb3x(dialect: SMBDialect): boolean {
    return dialect == SMBDialect.SMB_3_0 || dialect == SMBDialect.SMB_3_0_2 || dialect == SMBDialect.SMB_3_1_1;
  }

  /**
   * Whether any of the dialects in the set is an SMB 3.x dialect.
   *
   * @param dialects The supported dialects Set.
   * @return true if there is (at least) one SMB 3.x dialect in the set.
   */
  export function supportsSmb3x(dialects: Set<SMBDialect>): boolean {
    for (let dlt of dialects) {
      if (this.isSmb3x(dlt)) {
        return true;
      }
    }
    return false;
  }

  export function lookup(v: number): SMBDialect {
    return v as SMBDialect
  }
}
