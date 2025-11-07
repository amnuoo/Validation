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

