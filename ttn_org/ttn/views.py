from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import TemplateView
from django.http import Http404
from django.db import models

from .models import Community, Post


class IndexView(TemplateView):

    def get(self, request, **kwargs):
        c = Community.objects.all() \
                             .annotate(gateways_count=models.Count('gateways')) \
                             .order_by('-gateways_count')
        context = self.get_context_data(**kwargs)
        context['communities'] = c
        return self.render_to_response(context)


class CommunityView(TemplateView):

    def get(self, request, slug, **kwargs):
        c = Community.objects.filter(slug=slug)
        if not c:
            return redirect('ttn:new-community', search=slug)
        context = self.get_context_data(**kwargs)
        context['community'] = c[0]
        return self.render_to_response(context)


class PostView(TemplateView):

    def get(self, request, slug, pk, **kwargs):
        c = Community.objects.filter(slug=slug)
        if not c:
            return redirect('ttn:new-community', search=slug)
        post = get_object_or_404(Post, pk=pk)
        context = self.get_context_data(**kwargs)
        context['community'] = c[0]
        context['post'] = post
        return self.render_to_response(context)

