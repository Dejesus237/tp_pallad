from django.http import HttpResponse, JsonResponse
from . import functions

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

def index(request):
    return HttpResponse("Hello, world. You're at the DNS check index.")

@swagger_auto_schema(
    tags=["DnsRecordsCheck"],
    operation_summary="Vérifie les enregistrements DNS",
    method="post",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=["domain"],
        properties={
            "domain": openapi.Schema(type=openapi.TYPE_STRING),
        },
        example={
            "domain": "example.com"
        }
    ),

    responses={
    201: openapi.Response(
        description="ok",
        examples={
            "application/json": {
                "warnings": [],
                "spf": {
                    "warnings": [],
                    "v": "spf1",
                    "include": "include:_spf.google.com",
                    "all": "~all",
                    "raw": "v=spf1 include:_spf.google.com ~all"
                },
                "dmarc": {
                    "warnings": [],
                    "v": "DMARC1",
                    "p": "quarantine",
                    "sp": "reject",
                    "rua": "mailto:dmarc@example.com",
                    "raw": "v=DMARC1; p=quarantine; sp=reject; rua=mailto:dmarc@example.com"
                },
                "dkim": {
                    "warnings": [],
                    "results": [
                        {
                            "selector": "google",
                            "v": "DKIM1",
                            "k": "rsa",
                            "p": "MIIBIjANB...",
                            "raw": "v=DKIM1; k=rsa; p=MIIBIjANB...",
                            "warnings": []
                        }
                    ]
                },
                "spf_lookup_count": 1
            }
        }
    )
}

)
@api_view(["POST"])
def submit_request(request):
    try:
        data = request.data
        records = functions.analyze_domain_records(data["domain"])
        response = {}
        for r in records.keys():
            response[r] = records[r]
        return Response(response, status=201)
    
    except KeyError:
        return Response({"error": "Missing 'domain' field"}, status=400)
    
    except TypeError as e:
        return Response({"error": str(e)}, status=500)
