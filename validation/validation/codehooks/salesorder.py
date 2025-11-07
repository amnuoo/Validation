import frappe
from frappe import _
#decorator used to all this from the client side using frappe.call
@frappe.whitelist()
#defined python function to get item supplier which has item code
def get_item_supplier(item_code):
    #if item code is empty return
    if not item_code:
        return None

    #dictionary made for db calls 
    #item_code and item are childtable rows connected to parent doctype(item default)
    #here we can find rows in the child table  tied to the item
    filters = {"parent": item_code, "parenttype": "Item"}
    
    
   #calls get_value by (doctype,filters,fieldname)
    default_supplier = frappe.db.get_value("Item Default",filters,
    "default_supplier"
    #if get value has nothing returns none  
    ) or None
    #return the found supplier
    return default_supplier
    #sales order document is validating here
def validate_sales_order(doc, method=None):
   #defines a const EVIL for the supplier name we have to remove
    EVIL = "Evil Company"  

        #this loops through every item in the row
    for  row in doc.items:
        #checks for item_code if not present give ""and strip used for removing tailing spaces
        item_code = (row.item_code or "").strip()
        #if there is no item_code 
        if not item_code:
            
            continue

        #supplier is not there
        default_supplier = None
        #try block used for error handling
        try:
            #filter used to find item default record of the specific item
            filters = {"parent": item_code, "parenttype": "Item"}
            
            #calls get_value by (doctype,filters,fieldname)
            default_supplier = frappe.db.get_value(
                "Item Default",
                filters,
                "default_supplier"
            )
            #if error happens in try block it comes here instead of crashing
        except Exception as e:
            #records the error in frappe's error log
            frappe.log_error(f"Error fetching default supplier for item {item_code}: {str(e)}")
            #if supplier is equal to the const we defined 
            #throws the error message 
            #strip is used to remove unwanted tailing and check both are equal
        if default_supplier and default_supplier.strip() == EVIL:
            frappe.throw(_("We won't sell products of {0}.").format(EVIL))