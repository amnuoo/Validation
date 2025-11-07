
frappe.ui.form.on('Sales Order', {
    refresh: function(frm) {
    }
});

frappe.ui.form.on('Sales Order Item', {
    item_code: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (!row || !row.item_code) return;

        let company = frm.doc.company || null;

        frappe.call({
            method: "validation.validation.codehooks.salesorder.get_item_supplier",
            args: { 
                item_code: row.item_code,
                company: company
            },
            callback: function(r) {
                let default_supplier = r && r.message ? r.message : null;
                if (default_supplier && default_supplier.trim() === "Evil Company") {
                    frappe.msgprint("We won't sell products of Evil Company.");
                    frappe.model.set_value(cdt, cdn, "item_code", "");
                    frappe.model.set_value(cdt, cdn, "item_name", "");
                    frappe.model.set_value(cdt, cdn, "qty", 0);
                    frm.refresh_field("items");
                }
            }
        });
    },

    items_add: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (row && row.item_code) {
            frappe.ui.form.trigger("Sales Order Item", "item_code", frm, cdt, cdn);
        }
    }
});