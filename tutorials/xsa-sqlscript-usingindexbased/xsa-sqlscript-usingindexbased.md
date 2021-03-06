---
title: Using Index Based Cell access
description: Leveraging SQLScript in Stored Procedures & User Defined Functions
primary_tag: products>sap-hana
tags: [  tutorial>intermediate, topic>sql, products>sap-hana, products>sap-hana\,-express-edition  ]
---
## Prerequisites  
- **Proficiency:** Intermediate
- **Tutorials:** [Using Arrays](https://www.sap.com/developer/tutorials/xsa-sqlscript-usingarrays.html)

## Next Steps
- [Using Exception Handling](https://www.sap.com/developer/tutorials/xsa-sqlscript-trans-exception.html)

## Details
### You will learn  
This solution shows how to use index-based cell access to achieve the same. This option is the fastest among the solutions.
**Please note - This tutorial is based on SPS11**

### Time to Complete
**10 Min**.

---


[ACCORDION-BEGIN [Step 1: ](Edit previous procedure)]

Return to the procedure called `calculate_cumulative_sum_of_delivered_products`.

![procedure editor](1.png)

Delete all of the logic in the body of the procedure except for the declare statement for the `i` variable.

![delete logic](2.png)


[ACCORDION-END]

[ACCORDION-BEGIN [Step 2: ](Insert FOR loop)]

Next, instead of using arrays to access the input parameter table values and calculate the values, we will use index-based cell access to access the cells of both the input and output parameter directly. Insert the FOR loop as shown.

![for loop](3.png)


[ACCORDION-END]

[ACCORDION-BEGIN [Step 3: ](Check complete code)]

The completed code should look like the following. If you do not wish to type this code, you can reference the solution web page at `http://<hostname>:51013/workshop/admin/ui/exerciseMaster/?workshop=dev602&sub=ex2_23`

```
PROCEDURE "dev602.procedures::calculate_cumulative_sum_of_delivered_products" (  IN IM_PRODUCTS TABLE ( PRODUCTID NVARCHAR(10),                           DELIVERYDATE DAYDATE,                        NUM_DELIVERED_PRODUCTS BIGINT ),  OUT EX_PRODUCTS TABLE ( PRODUCTID NVARCHAR(10),                          DELIVERYDATE DAYDATE,                          NUM_DELIVERED_PRODUCTS BIGINT,                        CUMULATIVE_SUM BIGINT )  ) LANGUAGE SQLSCRIPT SQL SECURITY INVOKER READS SQL DATA ASBEGIN  DECLARE i  INTEGER  = 1;  FOR i IN 1..CARDINALITY(ARRAY_AGG(:IM_PRODUCTS.PRODUCTID)) DO     EX_PRODUCTS.PRODUCTID[:i]   = :IM_PRODUCTS.PRODUCTID[:i];     EX_PRODUCTS.DELIVERYDATE[:i]  =  :IM_PRODUCTS.DELIVERYDATE[:i] ;     EX_PRODUCTS.NUM_DELIVERED_PRODUCTS[:i] = :IM_PRODUCTS.NUM_DELIVERED_PRODUCTS[:i];          if :i = 1 then       EX_PRODUCTS.CUMULATIVE_SUM[:i] = :IM_PRODUCTS.NUM_DELIVERED_PRODUCTS[:i];       continue;     end if;     IF :IM_PRODUCTS.PRODUCTID[:i-1] <> :IM_PRODUCTS.PRODUCTID[:i]  THEN       EX_PRODUCTS.CUMULATIVE_SUM[:i] = :IM_PRODUCTS.NUM_DELIVERED_PRODUCTS[:i];     ELSE       EX_PRODUCTS.CUMULATIVE_SUM[:i] = :EX_PRODUCTS.CUMULATIVE_SUM[:i-1]                  + :IM_PRODUCTS.NUM_DELIVERED_PRODUCTS[:i];     END IF;  END FOR;END
```


[ACCORDION-END]

[ACCORDION-BEGIN [Step 4: ](Save and build)]

Click **Save**.

![save](5.png)

Use what you have learned already and perform a build on your `hdb` module.


[ACCORDION-END]

[ACCORDION-BEGIN [Step 5: ](Run call statement again)]

Return to the HRTT page and run the call statement again.

![HRTT](6.png)


[ACCORDION-END]

[ACCORDION-BEGIN [Step 6: ](Check the results)]

Check the results.

![results](7.png)

Notice the execution time is a little bit less than when doing the calculation using SQL, or using cursors or arrays.

![execution time](8.png)


[ACCORDION-END]




## Next Steps
- [Using Exception Handling](https://www.sap.com/developer/tutorials/xsa-sqlscript-trans-exception.html)
