// client script for doctype sales order
frappe.ui.form.on('Sales Order', {
    // run upcoming commands everytime we refresh the form
    refresh: function(frm) {
    }
});
// run the following code for sales order item child table of sales order doctype
frappe.ui.form.on('Sales Order Item', {
    //when item code field changes it goes through form,child table,childtable document
    item_code: function(frm, cdt, cdn) {
        //fetches the child table row user made changes
        let row = locals[cdt][cdn];
        //if nothing present return.
        if (!row || !row.item_code) return;

       
        //calls from the path to  whitelisted function
        frappe.call({
            //path
            method: "validation.validation.codehooks.salesorder.get_item_supplier",

            // we pass the argument to check in the python 
            args: { 
                item_code: row.item_code,
                },
                //this run when server responds to our argument
            callback: function(r) {
                // r is a message, we check if its empty or has a value
                let default_supplier = r && r.message ? r.message : null;
                //checks if supplier ie Evil Company
                if (default_supplier && default_supplier.trim() === "Evil Company") {
                //if its Evil Company then print this msg
                    frappe.msgprint("We won't sell products of Evil Company.");
                //And set the value of the fields into empty     
                    frappe.model.set_value(cdt, cdn, "item_code", "");
                    frappe.model.set_value(cdt, cdn, "item_name", "");
                    frappe.model.set_value(cdt, cdn, "qty", 0);
                //refresh child table    
                    frm.refresh_field("items");
                }
            }
        });
    },
    //this event runs when a new row is added to the childtable
    items_add: function(frm, cdt, cdn) {
    //for getting row    
        let row = locals[cdt][cdn];
    // to avoid duplication we run the functions above if same item is added
        if (row && row.item_code) {
            frappe.ui.form.trigger("Sales Order Item", "item_code", frm, cdt, cdn);
        }
    }
});