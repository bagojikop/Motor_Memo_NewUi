export interface ReportParam {
  key: string
  value: string
};
export interface MailNav {
  mailAddress: string
  ccAddress: string
  subject: string
  body: string
  fileType: string
};
export interface WappNav {
  mobileno: string
  fileType: string
}
export interface ReportDictionory {
  reportParams: ReportParam[]
  exportType?: string
  mail?: MailNav
  wapp?: WappNav
  reportCacheId?:string
  docName? :string

}