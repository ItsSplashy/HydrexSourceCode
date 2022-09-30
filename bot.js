// 13.8.0
//---STATUS FEATURE
const thankYou = `Thanks for supporting ❖ V O I D ❖`
const bye = 'We are hacking your pc for removing the status'
const theBrandName = brandName.toLowerCase()

bot.on('presenceUpdate', async (oldPresence, newPresence) => {
  try {
    const role = newPresence.guild.roles.cache.get(supporterRole);
    const newState = (newPresence?.activities?.find(o => o.id === 'custom'))?.state?.toLocaleLowerCase()
    const oldState = (oldPresence?.activities?.find(o => o.id === 'custom'))?.state?.toLocaleLowerCase()
    if(oldState !== theBrandName && oldPresence?.status !== 'offline' && newState?.includes(theBrandName)){
      newPresence.member.roles.add(role)
      newPresence?.member.send(thankYou)
    }
    else if(oldState?.includes(theBrandName) && newPresence?.status !== 'offline' && !newState?.includes(theBrandName)){
        newPresence.member.roles.remove(role)
        newPresence?.member.send(bye)
    }
  } catch (err) {
    console.log({error: err.message})
  }
})

bot.login(botToken);