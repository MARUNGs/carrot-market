"use server";

// twilio가 제대로 안 된다...
// 따라서 discord를 활용하여 처리하자.
export async function sendMessage(token: string) {
  console.log("----- send discord message ... -----");
  try {
    const response = await fetch(process.env.DISCORD_WEBHOOK!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `🥕캐럿마켓🥕에서 보낸 인증번호입니다. :: ${token}`,
      }),
    });

    if (response.ok) {
      console.log("[discord] :: success send message !");
    } else {
      const errData = await response.json();
      console.log(errData);
      console.log(`[discord] :: Error --> ${errData}`);
    }
  } catch (e) {
    console.log(`[discord] Failed to send message : ${e}`);
  }
}
