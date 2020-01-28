const client = require("../index").client

module.exports = (id) => {
    const g = client.guilds.get(id)
    return {
        roles: g.roles.map(r => {
            return {
                name:r.name,
                id:r.id,
                color:r.hexColor,
                perms:r.permissions,
                hoist:r.hoist
            }
        }),
        channels: g.channels.filter(c => c.type === "category").map(ch => {
            return {
                name:ch.name,
                position:ch.position,
                perms:ch.permissionOverwrites.filter(p => p.type === "role"),
                children: ch.children.map(child => {
                    return {
                        name:child.name,
                        type:child.type,
                        position:child.position,
                        perms: child.permissionOverwrites.filter(p => p.type === "role")
                    }
                })
            }
        })
    }
}