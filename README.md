# restnode
http://restnode.azurewebsites.net

Create
(Method: POST)	
1. /

Remove
(Method: DELETE)	
1.	/restaurant_id/:id
2.	/restaurant_id/:id/grade/:_id
3.	/restaurant/:attrib/:attrib_value
4.	/restaurant/coord/:lon/:lat
5.	/restaurant/or/:attrib1/:value1/:attrib2/:value2
6.	/restaurant/and/:attrib1/:value1/:attrib2/:value2

Update
(Method: PUT)	
1. /restaurant_id/:id/grade
2. /restaurant_id/:id
3. /:criteria_attrib/:criteria_attrib_value/:set_attrib/:set_attrib_value

Display
(Method: GET)	
1. /restaurant_id/:id
2. /restaurant_id/:id/avgscore
3. /restaurant
4. /restaurant/:attrib/:attrib_value
5. /restaurant/coord/:lon/:lat
6. /restaurant/or/:attrib1/:value1/:attrib2/:value2
7. /restaurant/and/:attrib1/:value1/:attrib2/:value2



