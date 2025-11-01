"use server"

export async function testServerAction(): Promise<string> {
  console.log("🧪 TEST SERVER ACTION CALLED!")
  return "Server action is working!"
}
