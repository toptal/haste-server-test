export enum Device {
  Desktop = 'desktop',
  Mobile = 'mobile',
  Ipad = 'ipad'
}

export const devices = [
  { device: Device.Desktop, viewport: { width: 1440, height: 900 } },
  { device: Device.Mobile, viewport: { width: 375, height: 640 } },
  { device: Device.Ipad, viewport: { width: 768, height: 1024 } }
]
