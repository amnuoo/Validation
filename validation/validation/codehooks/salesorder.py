import frappe
from frappe import _

@frappe.whitelist()
def get_item_supplier(item_code, company=None):
    
    if not item_code:
        return None

    
    filters = {"parent": item_code, "parenttype": "Item"}
    
    
    if company:
        filters["company"] = company
    
    default_supplier = frappe.db.get_value(
        "Item Default",
        filters,
        "default_supplier"
    ) or None

    return default_supplier

def validate_sales_order(doc, method=None):
   

    EVIL = "Evil Company"  

    
    company = doc.company if hasattr(doc, 'company') else None

    
    for idx, row in enumerate(doc.items or [], start=1):
        item_code = (row.item_code or "").strip()
        if not item_code:
            
            continue

        
        default_supplier = None
        try:
            filters = {"parent": item_code, "parenttype": "Item"}
            if company:
                filters["company"] = company
            
            default_supplier = frappe.db.get_value(
                "Item Default",
                filters,
                "default_supplier"
            )
        except Exception as e:
            frappe.log_error(f"Error fetching default supplier for item {item_code}: {str(e)}")

        if default_supplier and default_supplier.strip() == EVIL:
            
            frappe.throw(_("We won't sell products of {0}.").format(EVIL))