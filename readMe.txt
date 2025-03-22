to run server
npm star

to run autoloader server
npm run dev

to run test 
npm test

create User
curl -X POST -H "Content-Type: application/json" -d '{"name": [name], "surname": [surname], "birth_date": [date example "2023-10-27"], "sex": ["male"|| "female" || "other"]}' http://localhost:3000/users"
curl -X POST -H "Content-Type: application/json" -d "{\"name\": \"nuovo utente\", \"surname\": \"nuovo cognome\", \"birth_date\": \"2023-10-27\", \"sex\": \"male\"}" http://localhost:3000/users

delete user
curl -X DELETE http://localhost:3000/users/[userId]

get User List
limit and offset are optional
curl http://localhost:3000/users?limit=5&offset=0

get User By Id
curl http://localhost:3000/users/[userId]

get users by groupname
curl http://localhost:3000/[groupname]/users

get groups by userId
curl http://localhost:3000/[userId]/groups

get groups
curl http://localhost:3000/groups

get group by id
curl http://localhost:3000/groups/[groupId]

create group
curl -X POST -H "Content-Type: application/json" -d "{\"name\": \"Nuovo Nome Gruppo\"}" http://localhost:3000/groups

update group
curl -X PUT -H "Content-Type: application/json" -d "{\"name\": \"Nome Aggiornato\"}" http://localhost:3000/groups/[groupId]

delete group
curl -X DELETE http://localhost:3000/groups/[groupId]

associate user to group
curl -X POST -H "Content-Type: application/json" -d "{\"userId\": [userId]}" http://localhost:3000/groups/[groupId]/users

remove user from group
curl -X DELETE -H "Content-Type: application/json" -d "{\"userId\": [userId]}" http://localhost:3000/groups/[groupId]/users