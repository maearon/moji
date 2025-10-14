"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useTranslations } from "@/hooks/useTranslations"
import { ThemeSelector } from "@/components/settings/ThemeSelector"
import { LanguageSelector } from "@/components/settings/LanguageSelector"
import { CurrencySelector } from "@/components/settings/CurrencySelector"

export default function SettingsPageClientContent() {
  const t = useTranslations("settings")

  // --- Tab state with persistence ---
  const [activeTab, setActiveTab] = useState("appearance")
  useEffect(() => {
    localStorage.setItem("settings-tab", "appearance") // Default tab
    const saved = localStorage.getItem("settings-tab")
    if (saved) setActiveTab(saved)
  }, [])
  const handleTabChange = (val: string) => {
    setActiveTab(val)
    localStorage.setItem("settings-tab", val)
  }

  const [settings, setSettings] = useState({
    // Store Settings
    storeName: "Adidas Vietnam",
    storeDescription: "Official Adidas store in Vietnam",
    storeEmail: "admin@adidas.vn",
    storePhone: "+84 28 1234 5678",
    storeAddress: "123 Nguyen Hue, District 1, Ho Chi Minh City",

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderNotifications: true,
    inventoryAlerts: true,

    // Appearance
    theme: "light",
    language: "vi",
    currency: "VND",
    timezone: "Asia/Ho_Chi_Minh",

    // Security
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",

    // Shipping
    freeShippingThreshold: 500000,
    standardShippingCost: 30000,
    expressShippingCost: 50000,

    // Payment
    paymentMethods: ["credit_card", "bank_transfer", "cod"],
    autoRefund: true,
    refundPeriod: "14",
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    console.log("Saving settings:", settings)
    // Gửi settings lên API ở đây
  }

  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-400">
      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">

        {/* Store Settings */}
        <TabsContent value="store">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="uppercase tracking-wide">{t?.store?.title}</CardTitle>
              <CardDescription>{t?.store?.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">{t?.store?.storeName}</Label>
                  <Input
                    id="storeName"
                    value={settings.storeName}
                    onChange={(e) => handleSettingChange("storeName", e.target.value)}
                    className="border-2 border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">{t?.store?.storeEmail}</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => handleSettingChange("storeEmail", e.target.value)}
                    className="border-2 border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">{t?.store?.storePhone}</Label>
                  <Input
                    id="storePhone"
                    value={settings.storePhone}
                    onChange={(e) => handleSettingChange("storePhone", e.target.value)}
                    className="border-2 border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">{t?.store?.storeAddress}</Label>
                  <Input
                    id="storeAddress"
                    value={settings.storeAddress}
                    onChange={(e) => handleSettingChange("storeAddress", e.target.value)}
                    className="border-2 border-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeDescription">{t?.store?.storeDescription}</Label>
                <Textarea
                  id="storeDescription"
                  value={settings.storeDescription}
                  onChange={(e) => handleSettingChange("storeDescription", e.target.value)}
                  className="border-2 border-foreground"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="uppercase tracking-wide">{t?.notifications?.title}</CardTitle>
              <CardDescription>{t?.notifications?.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">{t?.notifications?.emailNotifications}</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">{t?.notifications?.smsNotifications}</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">{t?.notifications?.pushNotifications}</Label>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderNotifications">{t?.notifications?.orderNotifications}</Label>
                    <p className="text-sm text-muted-foreground">Get notified about new orders</p>
                  </div>
                  <Switch
                    id="orderNotifications"
                    checked={settings.orderNotifications}
                    onCheckedChange={(checked) => handleSettingChange("orderNotifications", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inventoryAlerts">{t?.notifications?.inventoryAlerts}</Label>
                    <p className="text-sm text-muted-foreground">Get alerts for low stock items</p>
                  </div>
                  <Switch
                    id="inventoryAlerts"
                    checked={settings.inventoryAlerts}
                    onCheckedChange={(checked) => handleSettingChange("inventoryAlerts", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="uppercase tracking-wide">{t?.appearance?.title}</CardTitle>
              <CardDescription>{t?.appearance?.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ThemeSelector />
                <LanguageSelector />
                {/* <CurrencySelector 
                  value={settings.currency} 
                  onChange={(value) => handleSettingChange("currency", value)} 
                />
                <div className="space-y-2">
                  <Label htmlFor="timezone">{t?.appearance?.timezone}</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                    <SelectTrigger className="border-2 border-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-foreground">
                      <SelectItem value="Asia/Ho_Chi_Minh">Ho Chi Minh (GMT+7)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="uppercase tracking-wide">Security Settings</CardTitle>
              <CardDescription>Configure security and authentication settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange("sessionTimeout", e.target.value)}
                      className="border-2 border-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                    <Input
                      id="passwordExpiry"
                      type="number"
                      value={settings.passwordExpiry}
                      onChange={(e) => handleSettingChange("passwordExpiry", e.target.value)}
                      className="border-2 border-foreground"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="uppercase tracking-wide">Shipping Configuration</CardTitle>
              <CardDescription>Configure shipping rates and policies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (VND)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => handleSettingChange("freeShippingThreshold", Number.parseInt(e.target.value))}
                    className="border-2 border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="standardShippingCost">Standard Shipping Cost (VND)</Label>
                  <Input
                    id="standardShippingCost"
                    type="number"
                    value={settings.standardShippingCost}
                    onChange={(e) => handleSettingChange("standardShippingCost", Number.parseInt(e.target.value))}
                    className="border-2 border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expressShippingCost">Express Shipping Cost (VND)</Label>
                  <Input
                    id="expressShippingCost"
                    type="number"
                    value={settings.expressShippingCost}
                    onChange={(e) => handleSettingChange("expressShippingCost", Number.parseInt(e.target.value))}
                    className="border-2 border-foreground"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="uppercase tracking-wide">Payment Configuration</CardTitle>
              <CardDescription>Configure payment methods and policies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoRefund">Automatic Refunds</Label>
                    <p className="text-sm text-muted-foreground">Automatically process refunds for cancelled orders</p>
                  </div>
                  <Switch
                    id="autoRefund"
                    checked={settings.autoRefund}
                    onCheckedChange={(checked) => handleSettingChange("autoRefund", checked)}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="refundPeriod">Refund Period (days)</Label>
                  <Input
                    id="refundPeriod"
                    type="number"
                    value={settings.refundPeriod}
                    onChange={(e) => handleSettingChange("refundPeriod", e.target.value)}
                    className="border-2 border-foreground max-w-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
