import dns.resolver
import dns.exception
import re
from enum import Enum
from typing import Optional, Dict, List, Set

#region Constants

class Codes(Enum):
    DOMAIN_NOT_FOUND = 1
    RECORD_NOT_FOUND = 2
    MULTIPLE_RECORDS_FOUND = 3
    DUPLICATE_RECORD_TERMS = 4
    RECORD_SYNTAX_ERROR = 5
    INVALID_DOMAIN = 7
    LOOKUPS_LIMIT = 8


resolver = dns.resolver.Resolver()
resolver.nameservers = [
    "1.1.1.1",      # Cloudflare
    "8.8.8.8",      # Google
    "9.9.9.9",      # Quad9
]
resolver.timeout = 2.0     # per try
resolver.lifetime = 5.0    # total

dkim_selectors = [
    '20161025', '20210112', '20220623', '20230601', 'a', 'a1', 'acdkim1', 'amazonses', 'aweber_key_a',
    'aweber_key_b', 'aweber_key_c', 'b', 'brevo1', 'brevo2', 'c', 'clab1', 'cm', 'd', 'default', 'dk',
    'dkim', 'dkim-1', 'dkim-2', 'dkim1', 'dkim1024', 'dkim2', 'dkim3', 'domain', 'e2ma-k1', 'e2ma-k2',
    'e2ma-k3', 'ecm1', 'email', 'eskerondemand1', 'fwd', 'gappssmtp', 'gm1', 'google', 'hs1', 'hs2',
    'hse1', 'hubspot', 'info', 'k', 'k1', 'k2', 'key1', 'key2', 'kl', 'kl2', 'klaviyo', 'kv', 'm1', 'm101',
    'm102', 'mail', 'mailjet', 'mailpoet1', 'mailpoet2', 'main', 'mandrill', 'mg', 'mimecast', 'mkto', 'mta0',
    'nce2048', 'pardot', 'pic', 'pp', 'protonmail', 'public', 's', 's1', 's2', 's2019', 's2020', 's2021',
    's2022', 's2023', 's2024', 's2025', 's2026', 'sable', 'salesforce', 'scph', 'selector1', 'selector1-', 'selector2',
    'sendgrid', 'server', 'sfdc', 'shopify', 'smtp', 'smtpapi', 'spop1024', 'test', 'v', 'x', 'zendesk1',
    'zmail', 'zoho'
]

#endregion

#region Validators

def validate_domain(domain: str) -> bool:
    """Validate domain format."""
    if not domain or len(domain) > 253:
        return False
    # Basic domain validation regex
    pattern = re.compile(
        r'^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*'
        r'[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$'
    )
    return bool(pattern.match(domain))

def parse_dmarc(dmarc_string: str) -> dict:
    """Parse DMARC record into key-value pairs."""
    result = dict(re.findall(r'(\w+)\s*=\s*([^;]+)', dmarc_string))
    result["raw"] = dmarc_string
    return result

def parse_spf(spf_string: str) -> dict:
    """
    Parse SPF record into components.
    Example result:
    { "v": "spf1",
      "ip4": "127.0.0.1/24",
      "include": "example.com",
      "all": "~" }
    """
    pattern = re.compile(r'([+\-~?]?)([a-zA-Z0-9]+)(?:[:=]([^ ]+))?')
    result = {}

    for part in spf_string.strip().split():
        m = pattern.fullmatch(part)
        if not m:
            continue

        qualifier, tag, value = m.groups()

        if tag == "all":
            result[tag] = qualifier or "+"
        elif value:
            # Handle multiple includes/redirects
            if tag in result:
                if not isinstance(result[tag], list):
                    result[tag] = [result[tag]]
                result[tag].append(value)
            else:
                result[tag] = value
        else:
            result[tag] = None

    result["raw"] = spf_string
    return result

def validate_dkim(dkim_string: str) -> bool:
    """Returns True if the DKIM string appears syntactically correct."""
    if not dkim_string:
        return False
        
    # Split by semicolons
    parts = [p.strip() for p in dkim_string.split(';') if p.strip()]
    
    if not parts:
        return False

    # Regex for valid tag=value
    tag_value_pattern = re.compile(r'^[a-zA-Z0-9]+=[^;]*$')
    tags_found = {}

    for part in parts:
        if not tag_value_pattern.match(part):
            return False
        key, value = part.split('=', 1)
        if key in tags_found:
            return False  # Duplicate tags not allowed
        tags_found[key] = value

    # Check version
    if 'v' not in tags_found or tags_found['v'] != 'DKIM1':
        return False

    # Check that 'p' exists (public key, can be empty for revoked keys)
    if 'p' not in tags_found:
        return False

    return True

def parse_dkim(dkim_string: str) -> dict:
    """Parse DKIM record and validate syntax."""
    if validate_dkim(dkim_string):
        result = dict(re.findall(r'(\w+)\s*=\s*([^;]+)', dkim_string))
        result["raw"] = dkim_string
        result["syntaxError"] = False
        return result
    else:
        return {"syntaxError": True, "raw": dkim_string}

#endregion

#region DNS Records

def get_A(domain: str) -> Optional[str]:
    """Get A record for domain."""
    if not validate_domain(domain):
        return None
        
    try:
        answers = resolver.resolve(domain, "A")
        for answer in answers:
            return str(answer.address)
    except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN, dns.exception.Timeout):
        return None
    except Exception as e:
        print(f"Error resolving A record for {domain}: {e}")
        return None

def get_SPF(domain: str) -> List[dict]:
    """Get SPF records for domain."""
    if not validate_domain(domain):
        return []
        
    try:
        results = []
        answers = resolver.resolve(domain, "TXT")
        for answer in answers:
            for txt in answer.strings:
                txt = txt.decode('utf-8', errors='ignore')
                if txt.startswith("v=spf1"):
                    results.append(parse_spf(txt))
        return results
    except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN, dns.exception.Timeout):
        return []
    except Exception as e:
        print(f"Error resolving SPF for {domain}: {e}")
        return []

def get_DMARC(domain: str) -> List[dict]:
    """Get DMARC records for domain."""
    if not validate_domain(domain):
        return []
        
    try:
        results = []
        answers = resolver.resolve(f"_dmarc.{domain}", "TXT")
        for answer in answers:
            for txt in answer.strings:
                txt = txt.decode('utf-8', errors='ignore')
                if txt.startswith("v=DMARC1"):
                    results.append(parse_dmarc(txt))
        return results
    except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN, dns.exception.Timeout):
        return []
    except Exception as e:
        print(f"Error resolving DMARC for {domain}: {e}")
        return []

def get_DKIM(domain: str) -> Dict[str, dict]:
    """Get DKIM records for domain using common selectors."""
    if not validate_domain(domain):
        return {}
    
    results = {}
    for selector in dkim_selectors:
        dkim_domain = f"{selector}._domainkey.{domain}"
        dkim = try_get_DKIM(dkim_domain)
        if dkim:
            if "results" not in results:
                results["results"] = []
            results["results"].append({ "selector": selector } | parse_dkim(dkim))
    return results
        
def try_get_DKIM(domain: str) -> Optional[str]:
    """Try to get DKIM record, handling CNAME indirection."""
    try:
        # First try direct TXT lookup
        try:
            txt_answers = resolver.resolve(domain, "TXT")
            for txt_answer in txt_answers:
                for txt in txt_answer.strings:
                    txt = txt.decode('utf-8', errors='ignore')
                    if txt and ('p=' in txt or 'v=' in txt):
                        return txt
        except dns.resolver.NoAnswer:
            pass
        
        # If no TXT, try CNAME then TXT
        try:
            answers = resolver.resolve(domain, "CNAME")
            for answer in answers:
                target = answer.target.to_text().rstrip('.')
                try:
                    txt_answers = resolver.resolve(target, "TXT")
                    for txt_answer in txt_answers:
                        for txt in txt_answer.strings:
                            txt = txt.decode('utf-8', errors='ignore')
                            if txt and ('p=' in txt or 'v=' in txt):
                                return txt
                except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN):
                    pass
        except dns.resolver.NoAnswer:
            pass
            
    except (dns.resolver.NXDOMAIN, dns.exception.Timeout):
        pass
    except Exception as e:
        # Silent failure for individual DKIM lookups
        pass
    
    return None

#endregion

#region DNS Analysis

MAX_LOOKUPS = 10

def count_lookups(domain: str, visited: Optional[Set[str]] = None) -> int:
    """
    Count DNS lookups required by SPF record.
    Returns count of lookups (mechanisms that trigger DNS queries).
    """
    if visited is None:
        visited = set()

    if domain in visited:
        return 0  # Prevent infinite loops

    visited.add(domain)

    spf_records = get_SPF(domain)
    if not spf_records:
        return 0

    count = 0
    
    # Process all SPF records (though there should only be one)
    for spf_record in spf_records:
        raw_spf = spf_record.get("raw", "")
        
        for part in raw_spf.split():
            p = part.lower()

            if p.startswith("include:"):
                count += 1
                if count > MAX_LOOKUPS:
                    return count
                include_domain = p.split(":", 1)[1]
                count += count_lookups(include_domain, visited)

            elif p.startswith("redirect="):
                count += 1
                if count > MAX_LOOKUPS:
                    return count
                redirect_domain = p.split("=", 1)[1]
                count += count_lookups(redirect_domain, visited)

            elif p == "a" or p.startswith("a:") or p.startswith("a/"):
                count += 1

            elif p == "mx" or p.startswith("mx:") or p.startswith("mx/"):
                count += 1

            elif p.startswith("exists:"):
                count += 1

            elif p == "ptr" or p.startswith("ptr:"):
                count += 1

    return min(count, MAX_LOOKUPS + 1)

def analyze_domain_records(domain: str) -> dict:
    """Analyze SPF, DMARC, and DKIM records for a domain."""
    if not validate_domain(domain):
        return {
            "warnings": [Codes.INVALID_DOMAIN.value],
            "spf": {"warnings": []},
            "dmarc": {"warnings": []},
            "dkim": {"warnings": []},
        }
    
    spf = get_SPF(domain)
    dmarc = get_DMARC(domain)
    dkim = get_DKIM(domain)

    result = {
        "warnings": [],
        "spf": {"warnings": []},
        "dmarc": {"warnings": []},
        "dkim": {"warnings": []},
    }

    if not spf and not dmarc and not dkim:
        result["warnings"].append(Codes.DOMAIN_NOT_FOUND.value)
        return result

    #region Warnings

    # No SPF Record Found
    if len(spf) == 0:
        result["spf"]["warnings"].append(Codes.RECORD_NOT_FOUND.value)
    # Multiple SPF Records Found
    elif len(spf) > 1:
        result["spf"]["warnings"].append(Codes.MULTIPLE_RECORDS_FOUND.value)

    # No DMARC Record Found
    if len(dmarc) == 0:
        result["dmarc"]["warnings"].append(Codes.RECORD_NOT_FOUND.value)
    # Multiple DMARC Records Found
    elif len(dmarc) > 1:
        result["dmarc"]["warnings"].append(Codes.MULTIPLE_RECORDS_FOUND.value)

    # No DKIM Record Found
    if len(dkim) == 0:
        result["dkim"]["warnings"].append(Codes.RECORD_NOT_FOUND.value)
    # Individual DKIM Syntax Check
    else:
        for rs in dkim["results"]:
            rs["warnings"] = []
            if rs["syntaxError"] == True:
                rs["warnings"].append(Codes.RECORD_SYNTAX_ERROR.value)
    
    #endregion

    # Adding the record values (safe merging)
    for s in spf:
        for key, value in s.items():
            if key not in result["spf"]:
                result["spf"][key] = value
    
    for d in dmarc:
        for key, value in d.items():
            if key not in result["dmarc"]:
                result["dmarc"][key] = value
    
    result["dkim"]["results"] = []
    for dk in dkim["results"]:
        dk.pop('syntaxError', None)
        result["dkim"]["results"].append(dk)

    # DNS Lookups
    try:
        result["spf_lookup_count"] = count_lookups(domain)
        if result["spf_lookup_count"] > MAX_LOOKUPS:
            result["spf"]["warnings"].append(Codes.LOOKUPS_LIMIT.value)
    except Exception as e:
        result["spf_lookup_count"] = None
        print(f"Error counting SPF lookups: {e}")

    return result

#endregion

#region RDAP (Unused)

import requests

def get_rdap_data(domain:str):
    url = f"https://rdap.org/domain/{domain}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: Could not find data (Status {response.status_code})")
            return {}
    except Exception as e:
        print(f"An error occurred: {e}")
        return {}

#endregion
