// validation/public/js/salesorder.js

frappe.ui.form.on('Sales Order', {
    // When the form loads, attach handlers for the Items table
    refresh: function(frm) {
        // Nothing needed here for now
    }
});

// Handle events on the child table rows (Sales Order Item)
frappe.ui.form.on('Sales Order Item', {
    item_code: function(frm, cdt, cdn) {
        // Called when item_code field on a row changes
        let row = locals[cdt][cdn];
        if (!row || !row.item_code) return;

        // Get company from the Sales Order form
        let company = frm.doc.company || null;
    
          // Call server method to fetch default supplier for the selected item
          frappe.call({
            method: "validation.validation.codehooks.salesorder.get_item_supplier",
            args: { 
                item_code: row.item_code,
                company: company
            },
            callback: function(r) {
                let default_supplier = r && r.message ? r.message : null;
                if (default_supplier && default_supplier.trim() === "Evil Company") {
                    // Prevent the user from leaving the field as-is
                    frappe.msgprint("We won't sell products of Evil Company.");
                }
            }
        });
    }
});